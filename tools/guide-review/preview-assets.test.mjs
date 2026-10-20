import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { collectPreviewAssets, previewContentType } from './preview-assets.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'etail-preview-assets-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const publicDirectory = path.join(root, 'public'), outputDirectory = path.join(root, 'out');
  mkdirSync(publicDirectory); mkdirSync(outputDirectory);
  const add = (file, body = 'asset') => {
    for (const directory of [publicDirectory, outputDirectory]) {
      mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
      writeFileSync(path.join(directory, file), body);
    }
  };
  return { root, publicDirectory, outputDirectory, add };
}

test('includes marketing artwork and nested authentic marks regardless of folder name', t => {
  const f = fixture(t);
  for (const file of ['marketing/business-handoff-v1.webp', 'brand/wallets/apple-pay.svg', 'type/regular.woff2']) f.add(file);
  const assets = collectPreviewAssets(f.publicDirectory, f.outputDirectory);
  assert.equal(assets.length, 3);
  assert(assets.some(asset => asset.route === '/marketing/business-handoff-v1.webp'));
  assert(assets.every(asset => /^[a-f0-9]{64}$/.test(asset.sha256)));
});

test('does not broaden public access to source, HTML, configuration or data files', t => {
  const f = fixture(t);
  for (const file of ['source.tsx', 'review.html', 'records.json', '.env', '_headers', 'debug.map', 'notes.txt', 'script.js']) f.add(file);
  assert.deepEqual(collectPreviewAssets(f.publicDirectory, f.outputDirectory), []);
});

test('rejects stale or missing exported artwork', t => {
  const f = fixture(t); f.add('marketing/hero.webp');
  writeFileSync(path.join(f.outputDirectory, 'marketing/hero.webp'), 'different');
  assert.throws(() => collectPreviewAssets(f.publicDirectory, f.outputDirectory), /differs from source/);
  rmSync(path.join(f.outputDirectory, 'marketing/hero.webp'));
  assert.throws(() => collectPreviewAssets(f.publicDirectory, f.outputDirectory), /ENOENT/);
});

test('does not follow symbolic links out of public assets', t => {
  const f = fixture(t);
  writeFileSync(path.join(f.root, 'outside.webp'), 'outside');
  symlinkSync(path.join(f.root, 'outside.webp'), path.join(f.publicDirectory, 'linked.webp'));
  assert.throws(() => collectPreviewAssets(f.publicDirectory, f.outputDirectory), /symbolic links/);
});

test('uses image MIME for extensionless social artwork and retains RSC/font types', () => {
  assert.equal(previewContentType('opengraph-image'), 'image/png');
  assert.equal(previewContentType('twitter-image'), 'image/png');
  assert.equal(previewContentType('marketing/hero.webp'), 'image/webp');
  assert.equal(previewContentType('brand/wallets/google-pay.svg'), 'image/svg+xml');
  assert.equal(previewContentType('type/regular.woff2'), 'font/woff2');
  assert.equal(previewContentType('guides.txt'), 'text/x-component; charset=utf-8');
});
