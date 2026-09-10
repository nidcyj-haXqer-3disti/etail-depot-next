#!/usr/bin/env python3
"""Run all handoff helpers in a source-only view; this is not a hash check."""
from pathlib import Path
import json
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'PACKAGE_MANIFEST.json').read_text())
with tempfile.TemporaryDirectory(prefix='etail-handoff-tests-') as directory:
    destination = Path(directory)
    for name in [*manifest['files'], 'PACKAGE_MANIFEST.json']:
        relative = Path(name)
        if relative.is_absolute() or '..' in relative.parts:
            raise ValueError('Unsafe handoff manifest path')
        source = ROOT / relative
        if source.is_symlink() or not source.is_file():
            raise ValueError('Missing or unsafe handoff source')
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
    print('Running all original helper tests against current handoff sources only; '
          'application/dependency files excluded; original package hashes are not re-certified.', flush=True)
    raise SystemExit(subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests',
                                     '-p', 'test_handoff_tools.py', '-v'], cwd=destination).returncode)
