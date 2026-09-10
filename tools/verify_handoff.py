#!/usr/bin/env python3
"""Read-only validation of the handoff, NOT validation of the future application."""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
import zipfile
from decimal import Decimal
from pathlib import Path, PurePosixPath
from typing import Any
from check_target import GuardError, load_targets, require
from seed_github_plan import validate_plan

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
 '00_START_HERE.md','01_PASTE_IN_CODEX.md','02_MASTER_BUILD_PROMPT.md','AGENTS.md',
 'project-targets.json','docs/SOURCE_PRECEDENCE.md','docs/PRODUCT.md',
 'docs/DATABASE_AND_DOMAIN.md','docs/ACCESS_POLICY.md','docs/WORKFLOWS.md',
 'docs/UX_CONTRACT.md','docs/SECURITY_AND_IDENTITY.md','docs/NETLIFY_DEPLOYMENT.md',
 'docs/GITHUB_PLAN.md','docs/LOCAL_AND_CODEX_SETUP.md','docs/DECISIONS.md',
 'docs/TEST_AND_EVIDENCE.md','docs/RESEARCH_NOTES.md','planning/TRACEABILITY.md',
 'planning/STATUS.md','planning/backlog.json','planning/backlog.csv',
 'contracts/acceptance-cases.json','contracts/api-surface.json','contracts/commercial-rules.json',
 'contracts/regression-fixtures.json','contracts/workflow-states.json','contracts/capability-example.json',
 'sources/inventory.json','sources/workbook-extract.json','assets/brand/logo.png','assets/brand/symbol.png',
 'tools/check_target.py','tools/seed_github_plan.py','tests/test_handoff_tools.py'
]

def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def safe_path(root: Path, value: str) -> Path:
    p = PurePosixPath(value)
    require(not p.is_absolute() and '..' not in p.parts and '\\' not in value, 'Unsafe manifest path.')
    resolved = (root / value).resolve()
    require(resolved.is_relative_to(root.resolve()), 'Manifest path escaped the package root.')
    return resolved

def verify_fixtures(rules: dict[str, Any], fixture: dict[str, Any]) -> int:
    """Check supplied arithmetic examples; does not implement the app or cost engine."""
    D = Decimal
    a = fixture['annual_pricing']; s = rules['plans']['SELECT']; p = rules['plans']['PREMIER']
    sales, count, spend = D(a['sales_usd']), D(a['payments']), D(a['eligible_purchases_usd'])
    select_fee = sales * D(s['processing_rate']) + count * D(s['processing_fixed_minor'])/100
    provider = sales * D(p['provider_fee_rate']) + count * D(p['provider_fixed_minor'])/100
    brand = sales * D(a['brand_cost_rate']); base = spend * D(s['base_cashback_rate'])
    extra = spend * D(p['additional_spending_bonus_rate']); fee_bonus = provider * D(p['provider_fee_bonus_rate'])
    combined = min(extra+fee_bonus,D(p['combined_bonus_cap_minor'])/100)
    net_select = select_fee + D(s['annual_fee_minor'])/100-base
    net_premier = provider+brand + D(p['annual_fee_minor'])/100-base-combined
    values = dict(select_processing_usd=select_fee,premier_provider_fee_usd=provider,premier_brand_cost_usd=brand,
                  premier_processing_usd=provider+brand,base_cashback_usd=base,premier_extra_spending_usd=extra,
                  premier_fee_bonus_usd=fee_bonus,premier_combined_bonus_usd=combined,
                  select_net_usd=net_select,premier_net_usd=net_premier,premier_saving_usd=net_select-net_premier)
    for key,value in values.items(): require(value == D(a['expected'][key]), f'Supplied fixture mismatch: {key}.')
    for item in fixture['bonus_cap']:
        actual = min(D(item['eligible_purchases_usd'])*D(p['additional_spending_bonus_rate'])+
                     D(item['eligible_provider_fee_usd'])*D(p['provider_fee_bonus_rate']), D(p['combined_bonus_cap_minor'])/100)
        require(actual==D(item['expected_extra_bonus_usd']), 'Supplied bonus-cap fixture mismatch.')
    c = fixture['collateral_purchase']; e = c['expected']
    require(int(e['collateral_minor'])==int(c['deposit_minor']) and int(e['obligation_minor'])==int(c['settled_purchase_minor']), 'Collateral/obligation meanings changed.')
    require(int(e['available_minor'])==int(e['collateral_minor'])-int(e['obligation_minor'])-int(e['holds_minor']), 'Capacity example mismatch.')
    q=fixture['concurrent_authorizations']
    require(sum(map(int,q['attempts_minor']))>int(q['backing_minor']) and q['both_may_approve'] is False, 'Invalid concurrency requirement example.')
    return len(values)+len(fixture['bonus_cap'])+3

def verify(root: Path, check_hashes: bool = True) -> dict[str, Any]:
    root=root.resolve()
    for name in REQUIRED: require(safe_path(root,name).is_file(), f'Required handoff file is missing: {name}.')
    require((root/'AGENTS.md').stat().st_size < 32768, 'Keep AGENTS.md under default instruction budget.')
    targets=load_targets(root/'project-targets.json')
    plan=json.loads((root/'planning/backlog.json').read_text()); validate_plan(plan)
    require(plan['repository'].casefold()==(targets['github']['owner']+'/'+targets['github']['repository_name']).casefold(), 'Target/backlog repository mismatch.')
    accepted=json.loads((root/'contracts/acceptance-cases.json').read_text())['cases']
    ids=[a['id'] for a in accepted]
    require(len(ids)==len(set(ids)), 'Duplicate acceptance IDs.')
    coverage=set()
    for task in plan['issues']:
        require(set(task['acceptance_ids']).issubset(ids), f'Unknown acceptance reference in {task["id"]}.')
        coverage.update(task['acceptance_ids'])
    require(set(ids)==coverage, 'Some acceptance cases lack a delivery task.')
    require(all(a['status']=='not-implemented' and not a['evidence'] for a in accepted), 'Original handoff must not claim application evidence.')
    api=json.loads((root/'contracts/api-surface.json').read_text())
    operations=api['operations']
    require(len({a['operation_id'] for a in operations})==len(operations), 'Duplicate operation IDs.')
    require(len({(a['method'],a['path']) for a in operations})==len(operations), 'Duplicate API method/path.')
    require(all(a['path'].startswith('/api/v1/') for a in operations), 'Wrong new API version.')
    require(sum(a['operation_id']=='SubmitCardRequest' for a in operations)==1, 'Require one canonical card-request submission operation.')
    checked_json=0
    for file in root.rglob('*.json'):
        if '.git' in file.parts: continue
        json.loads(file.read_text()); checked_json+=1
    inventory=json.loads((root/'sources/inventory.json').read_text()); xlsx=0; sheets=0
    for item in inventory['files']:
        path=safe_path(root,item['path'])
        require(path.stat().st_size==item['bytes'] and sha256(path)==item['sha256'], f'Original source changed: {item["path"]}.')
        if path.suffix=='.xlsx':
            with zipfile.ZipFile(path) as archive: require(archive.testzip() is None,'Source workbook ZIP CRC failed.')
            xlsx+=1; sheets+=len(item.get('sheets',[]))
    extract=json.loads((root/'sources/workbook-extract.json').read_text())
    source_hashes={Path(i['path']).name:i['sha256'] for i in inventory['files']}
    for book in extract['workbooks']:
        require(source_hashes[book['file']]==book['sha256'], 'Workbook extraction references wrong original source.')
    arithmetic=verify_fixtures(json.loads((root/'contracts/commercial-rules.json').read_text()),json.loads((root/'contracts/regression-fixtures.json').read_text()))
    hashed=0
    if check_hashes:
        manifest_path=root/'PACKAGE_MANIFEST.json'
        require(manifest_path.is_file(), 'PACKAGE_MANIFEST.json missing. This validates the initial handoff, not edited app code.')
        manifest=json.loads(manifest_path.read_text())
        for name,digest in manifest['files'].items():
            path=safe_path(root,name)
            require(path.is_file() and sha256(path)==digest, f'Handoff checksum mismatch: {name}.')
            require(path.suffix.lower() not in {'.ttf','.otf','.woff','.woff2','.pem','.key'}, 'Forbidden font/credential binary in handoff.')
            hashed+=1
    return {'result':'pass','validation_scope':'initial handoff only, NOT future application or cloud deployment',
            'required_files':len(REQUIRED),'json_files_parsed':checked_json,'milestones':len(plan['milestones']),
            'delivery_tasks':len(plan['issues']),'acceptance_cases':len(accepted),'core_api_operations':len(operations),
            'original_workbooks':xlsx,'source_worksheets':sheets,'fixture_arithmetic_assertions':arithmetic,
            'manifest_files_verified':hashed,'cost_engine_recomputed':False,'remote_calls':0}

def main(argv: list[str] | None = None) -> int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=ROOT)
    parser.add_argument('--skip-hashes',action='store_true',help='Package-maintainer structural validation before final manifest generation; not full integrity check.')
    args=parser.parse_args(argv)
    try:
        print(json.dumps(verify(args.root,not args.skip_hashes),indent=2));return 0
    except (GuardError,OSError,ValueError,KeyError,zipfile.BadZipFile) as exc:
        print(f'FAILED: {exc}',file=sys.stderr);return 2

if __name__=='__main__': raise SystemExit(main())
