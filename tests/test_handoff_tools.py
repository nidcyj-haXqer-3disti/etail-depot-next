"""Handoff tests only. GitHub mutations below are mocked; no network calls."""
from __future__ import annotations
import base64
import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from check_target import GuardError, check_github, check_netlify, load_targets, validate_manifest, validate_origin
from seed_github_plan import execute, main as seed_main, marker, render_issue, validate_plan
from verify_handoff import safe_path, verify, verify_fixtures

class FakeGitHub:
    def __init__(self,targets,public=False,missing_marker=False):
        self.targets=copy.deepcopy(targets);self.public=public;self.missing_marker=missing_marker
        self.labels=[];self.milestones=[];self.issues=[];self.writes=[];self.reads=[]
    def call(self,endpoint,method='GET',body=None):
        if method=='GET':
            self.reads.append(endpoint)
            if endpoint.endswith('/contents/project-targets.json'):
                if self.missing_marker:return {'encoding':'none'}
                return {'encoding':'base64','content':base64.b64encode(json.dumps(self.targets).encode()).decode()}
            return {'id':self.targets['github']['repository_id'],'full_name':self.targets['github']['owner']+'/'+self.targets['github']['repository_name'], 'private':not self.public,'archived':False}
        self.writes.append((endpoint,method,copy.deepcopy(body)))
        if endpoint.endswith('/labels'):self.labels.append(copy.deepcopy(body));return body
        if endpoint.endswith('/milestones'):
            row={**body,'number':len(self.milestones)+1};self.milestones.append(row);return row
        if endpoint.endswith('/issues'):
            row={**body,'number':len(self.issues)+1};self.issues.append(row);return row
        raise AssertionError('Unexpected mocked mutation')
    def pages(self,endpoint):
        self.reads.append(endpoint)
        if '/milestones' in endpoint:return copy.deepcopy(self.milestones)
        if '/labels' in endpoint:return copy.deepcopy(self.labels)
        if '/issues' in endpoint:return copy.deepcopy(self.issues)
        raise AssertionError('Unexpected mocked list')

class HandoffTests(unittest.TestCase):
    def setUp(self):
        self.targets=load_targets(ROOT/'project-targets.json')
        self.plan=json.loads((ROOT/'planning/backlog.json').read_text())
        self.repo=self.plan['repository']
    def bind(self):
        self.targets['github']['repository_id']=123456789
        return FakeGitHub(self.targets)
    def test_initial_manifest_accepts_unbound_new_targets(self):validate_manifest(self.targets)
    def test_expected_repository_local_guard(self):self.assertEqual(check_github(self.targets,self.repo),self.repo)
    def test_old_repository_rejected(self):
        with self.assertRaises(GuardError):check_github(self.targets,'nidcyj-haXqer-3disti/etail-depot-member-commerce')
    def test_wrong_owner_rejected(self):
        with self.assertRaises(GuardError):check_github(self.targets,'other/etail-depot-next')
    def test_public_repository_rejected(self):
        with self.assertRaises(GuardError):check_github(self.targets,self.repo,{'id':1,'full_name':self.repo,'private':False})
    def test_bound_repository_id_rejected(self):
        self.bind()
        with self.assertRaises(GuardError):check_github(self.targets,self.repo,{'id':2,'full_name':self.repo,'private':True})
    def test_old_site_rejected(self):
        with self.assertRaises(GuardError):check_netlify(self.targets,'7e49e5cf-5938-4e90-8c0e-026432311e0b','etail-depot-next')
    def test_unbound_site_rejected(self):
        self.targets['netlify']['site_id']=None
        with self.assertRaises(GuardError):check_netlify(self.targets,'new-test-id','etail-depot-next')
    def test_bound_site_accepted(self):
        self.targets['netlify'].update(site_id='new-test-id',canonical_origin='https://etail-depot-next.netlify.app')
        self.assertEqual(check_netlify(self.targets,'new-test-id','etail-depot-next','https://etail-depot-next.netlify.app'),'new-test-id')
    def test_wrong_site_name_rejected(self):
        self.targets['netlify']['site_id']='new-test-id'
        with self.assertRaises(GuardError):check_netlify(self.targets,'new-test-id','other')
    def test_old_and_numbered_domains_rejected(self):
        for host in ['etaildepot.com','www.etaildepot.com','x.etaildepot.com','etail-depot-member-commerce.netlify.app','xyz--etail-depot-member-commerce.netlify.app']:
            with self.subTest(host=host),self.assertRaises(GuardError):validate_origin('https://'+host)
    def test_origin_credentials_path_query_http_rejected(self):
        for url in ['http://new.example','https://a:b@new.example','https://new.example/login','https://new.example?token=x','https://localhost','https://new.example:8080']:
            with self.subTest(url=url),self.assertRaises(GuardError):validate_origin(url)
    def test_new_origin_normalizes(self):self.assertEqual(validate_origin('https://NEW.example:443/'),'https://new.example')
    def test_disabled_boundary_cannot_be_removed(self):
        self.targets['isolation']['new_database_required']=False
        with self.assertRaises(GuardError):validate_manifest(self.targets)
    def test_live_money_manifest_rejected(self):
        self.targets['release']['real_money_allowed']=True
        with self.assertRaises(GuardError):validate_manifest(self.targets)
    def test_immutable_deny_list(self):
        self.targets['denied']['netlify_site_ids']=[]
        with self.assertRaises(GuardError):validate_manifest(self.targets)
    def test_dry_run_never_constructs_network_client(self):
        with patch('seed_github_plan.GitHubCLI',side_effect=AssertionError('Network forbidden')):
            result=execute(self.targets,self.plan,self.repo)
        self.assertEqual(result['mode'],'dry-run');self.assertEqual(result['created']['issues'],0)
    def test_cli_default_dry_run(self):
        with patch('seed_github_plan.GitHubCLI',side_effect=AssertionError('Network forbidden')),patch('builtins.print'):
            self.assertEqual(seed_main([]),0)
    def test_apply_requires_explicit_repository(self):
        with patch('builtins.print'):self.assertEqual(seed_main(['--apply']),2)
    def test_apply_requires_bound_id_before_network(self):
        self.targets['github']['repository_id']=None
        with patch('seed_github_plan.GitHubCLI',side_effect=AssertionError('Network forbidden')),self.assertRaises(GuardError):
            execute(self.targets,self.plan,self.repo,True)
    def test_mocked_apply_creates_expected_plan(self):
        fake=self.bind();result=execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(result['created'],{'labels':15,'milestones':8,'issues':32})
        self.assertTrue(all(method=='POST' for _,method,_ in fake.writes))
        self.assertTrue(all(endpoint.startswith('repos/'+self.repo+'/') for endpoint,_,_ in fake.writes))
    def test_mocked_apply_is_rerunnable_without_duplicates(self):
        fake=self.bind();execute(self.targets,self.plan,self.repo,True,fake);before=len(fake.writes)
        result=execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(result['created'],{'labels':0,'milestones':0,'issues':0});self.assertEqual(before,len(fake.writes))
        self.assertEqual(result['existing_issues'],32)
    def test_apply_public_remote_no_writes(self):
        fake=self.bind();fake.public=True
        with self.assertRaises(GuardError):execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(fake.writes,[])
    def test_apply_missing_marker_no_writes(self):
        fake=self.bind();fake.missing_marker=True
        with self.assertRaises(GuardError):execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(fake.writes,[])
    def test_apply_wrong_remote_marker_no_writes(self):
        fake=self.bind();fake.targets['project_key']='OTHER'
        with self.assertRaises(GuardError):execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(fake.writes,[])
    def test_duplicate_remote_issue_marker_no_writes(self):
        fake=self.bind();fake.issues=[{'body':marker('EDN-001')},{'body':marker('EDN-001')}]
        with self.assertRaises(GuardError):execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(fake.writes,[])
    def test_closed_issue_is_not_reopened(self):
        fake=self.bind();fake.issues=[{'body':marker('EDN-001'),'state':'closed'}]
        result=execute(self.targets,self.plan,self.repo,True,fake)
        self.assertEqual(result['existing_issues'],1);self.assertEqual(fake.issues[0]['state'],'closed')
    def test_cycle_rejected(self):
        self.plan['issues'][0]['depends_on']=['EDN-002']
        with self.assertRaises(GuardError):validate_plan(self.plan)
    def test_duplicate_issue_id_rejected(self):
        self.plan['issues'][1]['id']=self.plan['issues'][0]['id']
        with self.assertRaises(GuardError):validate_plan(self.plan)
    def test_backlog_wrong_repo_rejected_before_network(self):
        self.plan['repository']='other/new'
        with self.assertRaises(GuardError):execute(self.targets,self.plan,self.repo)
    def test_issue_body_preserves_acceptance_and_marker(self):
        body=render_issue(self.plan['issues'][0]);self.assertIn(marker('EDN-001'),body);self.assertIn('NEW-04',body)
    def test_path_escape_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            for p in ['../outside','/etc/passwd','sub/../../outside','..\\outside']:
                with self.subTest(path=p),self.assertRaises(GuardError):safe_path(Path(temp),p)
    def test_fixture_arithmetic(self):
        rules=json.loads((ROOT/'contracts/commercial-rules.json').read_text());fixture=json.loads((ROOT/'contracts/regression-fixtures.json').read_text())
        self.assertEqual(verify_fixtures(rules,fixture),17)
    def test_wrong_fixture_detected(self):
        rules=json.loads((ROOT/'contracts/commercial-rules.json').read_text());fixture=json.loads((ROOT/'contracts/regression-fixtures.json').read_text())
        fixture['annual_pricing']['expected']['premier_saving_usd']='601'
        with self.assertRaises(GuardError):verify_fixtures(rules,fixture)
    def test_full_structural_handoff(self):
        result=verify(ROOT,False)
        self.assertEqual(result['acceptance_cases'],72);self.assertEqual(result['core_api_operations'],77)  # Original 44 plus the planned merchant hierarchy/channel operations.
        self.assertEqual(result['original_workbooks'],2);self.assertEqual(result['remote_calls'],0)

if __name__=='__main__':unittest.main()
