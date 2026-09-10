#!/usr/bin/env python3
"""Import the supplied plan to the NEW private repo. Default dry run: no network."""
from __future__ import annotations
import argparse
import base64
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any
from check_target import GuardError, PROJECT_KEY, check_github, load_targets, require, validate_manifest

ROOT = Path(__file__).resolve().parents[1]
MARKER_PREFIX = 'etail-depot-next:'

class GitHubCLI:
    """Fixed github.com API client. No shell, tokens in output, or remote arbitrary URL."""
    def call(self, endpoint: str, method: str = 'GET', body: dict[str, Any] | None = None) -> Any:
        require(endpoint.startswith('repos/') and '://' not in endpoint and '..' not in endpoint, 'Unexpected GitHub endpoint.')
        args = ['gh', 'api', '--hostname', 'github.com', '--method', method, endpoint,
                '-H', 'Accept: application/vnd.github+json']
        if body is not None:
            args += ['--input', '-']
        env = dict(os.environ); env['GH_PROMPT_DISABLED'] = '1'
        try:
            p = subprocess.run(args, input=json.dumps(body) if body is not None else None,
                               text=True, capture_output=True, check=False, timeout=45, env=env)
        except FileNotFoundError as exc:
            raise GuardError('GitHub CLI is not installed. Use authorized GitHub tools or install/authenticate gh.') from exc
        except subprocess.TimeoutExpired as exc:
            raise GuardError('GitHub request timed out. Rerun to reconcile existing markers; do not assume the write failed.') from exc
        require(p.returncode == 0, f'GitHub {method} request failed (exit {p.returncode}). Verify permissions in the authorized CLI; no token or raw error is echoed.')
        try:
            return json.loads(p.stdout) if p.stdout.strip() else None
        except json.JSONDecodeError as exc:
            raise GuardError('GitHub returned a non-JSON response.') from exc

    def pages(self, endpoint: str) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        separator = '&' if '?' in endpoint else '?'
        for page in range(1, 101):
            data = self.call(f'{endpoint}{separator}per_page=100&page={page}')
            require(isinstance(data, list), 'Expected a GitHub result list.')
            items.extend(data)
            if len(data) < 100:
                return items
        raise GuardError('Planning pagination exceeded the safety limit; inspect the intended repository manually.')

def validate_plan(plan: dict[str, Any]) -> None:
    require(plan.get('project_key') == PROJECT_KEY, 'Wrong backlog project marker.')
    for key in ['milestones', 'labels', 'issues']:
        require(isinstance(plan.get(key), list) and bool(plan[key]), f'Missing {key}.')
    issues = plan['issues']; ids = [x['id'] for x in issues]
    require(len(ids) == len(set(ids)) and all(re.fullmatch(r'EDN-\d{3}', x) for x in ids), 'Duplicate or malformed issue IDs.')
    milestones = [m['id'] for m in plan['milestones']]
    require(len(milestones) == len(set(milestones)), 'Duplicate milestone IDs.')
    label_names = [l['name'] for l in plan['labels']]
    require(len(label_names) == len(set(label_names)), 'Duplicate label names.')
    for item in issues:
        require(item['milestone'] in milestones, 'Unknown milestone.')
        require(set(item['depends_on']).issubset(ids) and item['id'] not in item['depends_on'], 'Unknown/self dependency.')
        require(f"area:{item['area']}" in label_names and f"priority:{item['priority']}" in label_names, 'Issue label missing from plan.')
    visiting: set[str] = set(); done: set[str] = set(); lookup = {i['id']: i for i in issues}
    def visit(key: str) -> None:
        require(key not in visiting, 'Backlog dependencies contain a cycle.')
        if key in done: return
        visiting.add(key)
        for dep in lookup[key]['depends_on']: visit(dep)
        visiting.remove(key); done.add(key)
    for key in ids: visit(key)

def marker(task_id: str) -> str:
    return f'<!-- {MARKER_PREFIX}{task_id} -->'

def render_issue(item: dict[str, Any]) -> str:
    dependencies = ', '.join(item['depends_on']) or 'None'
    return '\n\n'.join([
        marker(item['id']), item['description'],
        f"## Delivery contract\nMilestone: {item['milestone']}\n\nDependencies: {dependencies}\n\nAcceptance IDs: {', '.join(item['acceptance_ids'])}",
        '## Required deliverables\n' + '\n'.join('- [ ] '+v for v in item['required_deliverables']),
        '## Safety and evidence\nNew project only. Use AGENTS.md and the current master brief. '
        'Do not create a second card workflow, reuse old resources, or mark tests passed without executing them. '
        'Link exact commits, commands, database/browser evidence and unresolved manual checks. Update planning/STATUS.md.'
    ])

def execute(targets: dict[str, Any], plan: dict[str, Any], repo: str,
            apply: bool = False, client: GitHubCLI | None = None) -> dict[str, Any]:
    expected = check_github(targets, repo); validate_plan(plan)
    require(str(plan.get('repository', '')).casefold() == expected.casefold(), 'Backlog target differs; update both only after approved naming change.')
    summary: dict[str, Any] = {'mode': 'apply' if apply else 'dry-run', 'repository': expected,
                              'planned': {k:len(plan[k]) for k in ['labels','milestones','issues']},
                              'created': {'labels':0,'milestones':0,'issues':0}, 'existing_issues':0}
    if not apply:
        summary['tasks'] = [f"{i['id']} [{i['milestone']}] {i['title']}" for i in plan['issues']]
        summary['notice'] = 'No network calls, repository creation, code push, merge or deployment.'
        return summary
    # Require binding even on first run; prevents matching a newly occupied name alone.
    require(targets['github'].get('repository_id') is not None, 'Bind the verified new repository ID before --apply.')
    api = client or GitHubCLI()
    remote = api.call(f'repos/{expected}')
    check_github(targets, expected, remote)
    # Read marker from the repository default branch, not from an untrusted issue body.
    raw = api.call(f'repos/{expected}/contents/project-targets.json')
    require(isinstance(raw, dict) and raw.get('encoding') == 'base64', 'Remote project-targets.json marker is missing.')
    try:
        remote_targets = json.loads(base64.b64decode(raw['content']).decode('utf-8'))
    except (KeyError, ValueError, UnicodeError) as exc:
        raise GuardError('Remote project marker is unreadable.') from exc
    validate_manifest(remote_targets)
    check_github(remote_targets, expected, remote)
    require(str(remote_targets['github'].get('repository_id')) == str(remote['id']), 'Remote project marker is not bound to this repository ID.')
    # Read/reconcile everything before any write. Duplicate marker means human inspection.
    existing_labels = api.pages(f'repos/{expected}/labels')
    existing_milestones = api.pages(f'repos/{expected}/milestones?state=all')
    existing_issues = [i for i in api.pages(f'repos/{expected}/issues?state=all') if 'pull_request' not in i]
    issue_map: dict[str, Any] = {}
    for row in existing_issues:
        matches = re.findall(r'<!-- etail-depot-next:(EDN-\d{3}) -->', row.get('body') or '')
        for key in matches:
            require(key not in issue_map, f'Duplicate remote marker {key}; no writes performed.')
            issue_map[key] = row
    label_names = {l['name'] for l in existing_labels}
    milestone_map: dict[str, int] = {}
    for m in plan['milestones']:
        title = f"{m['id']} — {m['title']}"
        found = [x for x in existing_milestones if x['title'] == title]
        require(len(found) <= 1, f'Duplicate milestone {title}; no writes performed.')
        if found: milestone_map[m['id']] = found[0]['number']
    for label in plan['labels']:
        if label['name'] not in label_names:
            api.call(f'repos/{expected}/labels', 'POST', label)
            summary['created']['labels'] += 1
    for m in plan['milestones']:
        if m['id'] not in milestone_map:
            new = api.call(f'repos/{expected}/milestones','POST',{'title':f"{m['id']} — {m['title']}",'description':m['description']})
            milestone_map[m['id']] = new['number']; summary['created']['milestones'] += 1
    for item in plan['issues']:
        if item['id'] in issue_map:
            summary['existing_issues'] += 1; continue
        api.call(f'repos/{expected}/issues','POST',{'title':f"[{item['id']}] {item['title']}", 'body':render_issue(item),
                 'milestone':milestone_map[item['milestone']], 'labels':[f"area:{item['area']}",f"priority:{item['priority']}"]})
        summary['created']['issues'] += 1
    summary['notice'] = 'Created only missing planning records. No existing issue edited/deleted; no repository creation, push, merge, secrets or deployment.'
    return summary

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Explicitly create missing planning records in the verified NEW private repo.')
    parser.add_argument('--repo', help='Explicit owner/name; required with --apply.')
    parser.add_argument('--targets',type=Path, default=ROOT/'project-targets.json')
    parser.add_argument('--backlog',type=Path, default=ROOT/'planning/backlog.json')
    args = parser.parse_args(argv)
    try:
        targets = load_targets(args.targets)
        plan = json.loads(args.backlog.read_text(encoding='utf-8'))
        require(not args.apply or bool(args.repo), '--apply requires an explicit --repo.')
        repo = args.repo or targets['github']['owner']+'/'+targets['github']['repository_name']
        print(json.dumps(execute(targets, plan, repo, args.apply),indent=2)); return 0
    except (GuardError,OSError,ValueError,KeyError) as exc:
        print(f'BLOCKED: {exc}',file=sys.stderr); return 2

if __name__ == '__main__':
    raise SystemExit(main())
