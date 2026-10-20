import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const assetExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf']);
const types = {
  '.html': 'text/html; charset=utf-8', '.txt': 'text/x-component; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

/** Enumerate exact exported artwork/font files, rather than assuming their folder names. */
export function collectPreviewAssets(publicDirectory, outputDirectory) {
  const files = [];
  const visit = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Preview public assets must not be symbolic links');
      if (entry.isDirectory()) { visit(source); continue; }
      if (!entry.isFile() || !assetExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const file = path.relative(publicDirectory, source).split(path.sep).join('/');
      const original = readFileSync(source);
      const exported = readFileSync(path.join(outputDirectory, file));
      if (sha256(original) !== sha256(exported)) throw new Error(`Exported asset differs from source: ${file}`);
      files.push({ route: `/${file}`, file, bytes: exported.length, sha256: sha256(exported) });
    }
  };
  visit(publicDirectory);
  return files.sort((a, b) => a.file.localeCompare(b.file));
}

export function previewContentType(file) {
  if (file === 'opengraph-image' || file === 'twitter-image') return 'image/png';
  return types[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
}
