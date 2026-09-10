#!/usr/bin/env python3
"""Read-only local target guard. Remote authorization/identity must still be verified."""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

PROJECT_KEY = 'ETAIL_DEPOT_NEXT_GREENFIELD_2026'
DENIED_NAMES = frozenset({'etail-depot-member-commerce', 'etail-depot-webapp'})
DENIED_IDS = frozenset({'7e49e5cf-5938-4e90-8c0e-026432311e0b'})
DENIED_DOMAINS = frozenset({'etaildepot.com', 'etail-depot-member-commerce.netlify.app', 'etail-depot-webapp.netlify.app'})
ROOT = Path(__file__).resolve().parents[1]

class GuardError(ValueError):
    """Unsafe or unbound project target."""

def require(condition: bool, message: str) -> None:
    if not condition:
        raise GuardError(message)

def load_targets(path: Path | None = None) -> dict[str, Any]:
    data = json.loads((path or ROOT / 'project-targets.json').read_text(encoding='utf-8'))
    validate_manifest(data)
    return data

def old_domain(host: str) -> bool:
    host = host.lower().rstrip('.')
    return any(host == d or host.endswith('.' + d) or host.endswith('--' + d) for d in DENIED_DOMAINS)

def validate_origin(value: str) -> str:
    require(isinstance(value, str) and bool(value), 'A verified new HTTPS origin is required.')
    try:
        url = urlsplit(value)
        port = url.port
    except ValueError as exc:
        raise GuardError('Malformed public origin.') from exc
    require(url.scheme == 'https' and bool(url.hostname), 'Public origin must be HTTPS.')
    require(url.username is None and url.password is None, 'Credentials cannot appear in an origin.')
    require(url.path in ('', '/') and not url.query and not url.fragment, 'Use an origin, not a page or callback URL.')
    require(port in (None, 443), 'Unexpected public origin port.')
    require(not old_domain(url.hostname or ''), 'An existing Etail Depot domain is forbidden.')
    require(url.hostname not in ('localhost', '127.0.0.1', '::1'), 'Hosted public origin cannot be loopback.')
    return 'https://' + url.netloc.lower().removesuffix(':443')

def validate_manifest(data: dict[str, Any]) -> None:
    require(data.get('project_key') == PROJECT_KEY and data.get('delivery') == 'fresh-sandbox', 'Wrong project marker.')
    gh, nf = data.get('github', {}), data.get('netlify', {})
    for value, label in [(gh.get('owner'), 'owner'), (gh.get('repository_name'), 'repository'), (nf.get('site_name'), 'site')]:
        require(isinstance(value, str) and bool(re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*', value)), f'Invalid {label} name.')
    require(gh['repository_name'].lower() not in DENIED_NAMES and nf['site_name'].lower() not in DENIED_NAMES, 'Existing resource name is forbidden.')
    require(gh.get('private') is True, 'The new repository must be private.')
    require(nf.get('site_id') not in DENIED_IDS, 'Existing Netlify site ID is forbidden.')
    isolation = data.get('isolation', {})
    for key in ['new_database_required', 'new_identity_required', 'new_secrets_required']:
        require(isolation.get(key) is True, f'Required isolation flag missing: {key}.')
    for key in ['import_old_customer_data', 'copy_old_application_code']:
        require(isolation.get(key) is False, f'Forbidden legacy reuse: {key}.')
    release = data.get('release', {})
    require(release.get('real_money_allowed') is False, 'Real money cannot be enabled by this project brief.')
    for key in ['public_access_requires_review_approval', 'feature_merge_requires_review_approval', 'purchases_or_plan_upgrades_require_approval']:
        require(release.get(key) is True, f'Required approval boundary missing: {key}.')
    require(DENIED_NAMES.issubset(set(data.get('denied', {}).get('repository_names', []))), 'Do not remove denied repository names.')
    require(DENIED_IDS.issubset(set(data.get('denied', {}).get('netlify_site_ids', []))), 'Do not remove denied site IDs.')
    if nf.get('canonical_origin') is not None:
        validate_origin(nf['canonical_origin'])

def check_github(data: dict[str, Any], repo: str, remote: dict[str, Any] | None = None) -> str:
    validate_manifest(data)
    gh = data['github']
    expected = gh['owner'] + '/' + gh['repository_name']
    require(repo.casefold() == expected.casefold(), 'Repository does not match the explicit new-project target.')
    if remote is not None:
        require(str(remote.get('full_name', '')).casefold() == expected.casefold(), 'Remote repository identity differs.')
        require(remote.get('private') is True, 'Remote repository is not private.')
        require(remote.get('archived') is not True, 'Remote repository is archived.')
        require(isinstance(remote.get('id'), int) and not isinstance(remote.get('id'), bool) and remote['id'] > 0, 'Remote repository ID missing.')
        if gh.get('repository_id') is not None:
            require(str(remote['id']) == str(gh['repository_id']), 'Bound repository ID mismatch.')
    return expected

def check_netlify(data: dict[str, Any], site_id: str, name: str, origin: str | None = None) -> str:
    validate_manifest(data)
    nf = data['netlify']
    require(site_id not in DENIED_IDS, 'Existing Netlify site ID is forbidden.')
    require(bool(nf.get('site_id')), 'New Netlify site ID is not bound yet; create and verify the new resource first.')
    require(site_id == nf['site_id'] and name == nf['site_name'], 'Netlify site name/ID does not match the verified binding.')
    if origin is not None:
        require(bool(nf.get('canonical_origin')), 'Canonical public origin is not bound yet.')
        require(validate_origin(origin) == validate_origin(nf['canonical_origin']), 'Canonical public origin mismatch.')
    return site_id

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--targets', type=Path, default=ROOT / 'project-targets.json')
    commands = parser.add_subparsers(dest='command', required=True)
    g = commands.add_parser('github'); g.add_argument('--repo', required=True)
    n = commands.add_parser('netlify'); n.add_argument('--id', required=True); n.add_argument('--name', required=True); n.add_argument('--origin')
    args = parser.parse_args(argv)
    try:
        data = load_targets(args.targets)
        result = check_github(data, args.repo) if args.command == 'github' else check_netlify(data, args.id, args.name, args.origin)
        print(f'Local target guard passed: {result}. No remote operation performed; verify remote metadata before writes.')
        return 0
    except (GuardError, OSError, ValueError) as exc:
        print(f'BLOCKED: {exc}', file=sys.stderr); return 2

if __name__ == '__main__':
    raise SystemExit(main())
