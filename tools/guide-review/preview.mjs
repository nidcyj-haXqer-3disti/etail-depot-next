/** Fixed, immutable-in-process allowlist for the accepted Guides loopback review; no source or archive endpoint. */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { previewContentType } from './preview-assets.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const manifest=JSON.parse(readFileSync(path.join(root,'artifacts/guides-review/manifest.json'),'utf8'));
const directory=path.resolve(root,manifest.outputDirectory);
const port=3223;
const sha=body=>createHash('sha256').update(body).digest('hex');
const cache=new Map();
const scriptHashes=new Set();
for(const entry of manifest.files){
  if(!Object.hasOwn(manifest.routes,entry.route) || manifest.routes[entry.route]!==entry.file) throw new Error('Manifest route mismatch');
  const target=path.resolve(directory,entry.file);
  if(!target.startsWith(directory+path.sep)) throw new Error('Invalid output path');
  const bytes=readFileSync(target); if(sha(bytes)!==entry.sha256) throw new Error('Output differs from frozen manifest');
  cache.set(entry.route,{bytes,file:entry.file});
  if(entry.file.endsWith('.html')) for(const match of bytes.toString().matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) if(!/\bsrc=/.test(match[1])) scriptHashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
}
const headers={
  'X-Robots-Tag':'noindex, nofollow, noarchive','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY',
  'Content-Security-Policy':`default-src 'none'; script-src 'self' ${[...scriptHashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
};
const server=createServer((req,res)=>{
 req.resume();
 const send=(status,body,type='text/plain; charset=utf-8')=>{res.writeHead(status,{...headers,'Content-Type':type,...(status===405?{Allow:'GET, HEAD'}:{})});res.end(req.method==='HEAD'?undefined:body);};
 if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host)) return send(403,'Local preview only');
 if(!['GET','HEAD'].includes(req.method)) return send(405,'Method not allowed');
 if(!req.url.startsWith('/') || /%(?:2e|2f|5c|00)/i.test(req.url) || req.url.includes('\\') || req.url.split('?')[0].split('/').some(p=>p==='.'||p==='..')) return send(404,'Not found');
 const url=new URL(req.url,`http://127.0.0.1:${port}`);
 if(url.pathname==='/robots.txt'&&!url.search) return send(200,'User-agent: *\nDisallow: /\n');
 // Next export navigation sends a fixed local payload with an opaque cache key. No user search query is accepted.
 if(url.search && !(url.pathname.endsWith('.txt') && [...url.searchParams.keys()].length===1 && url.searchParams.has('_rsc') && /^[a-zA-Z0-9_-]{1,100}$/.test(url.searchParams.get('_rsc')))) return send(404,'Not found');
 const item=cache.get(url.pathname);
 if(!item)return send(404,'Not found');
 return send(200,item.bytes,previewContentType(item.file));
});
server.listen(port,'127.0.0.1',()=>console.log(`Guides review preview http://127.0.0.1:${port}/guides (${manifest.sourceFingerprint})`));
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(()=>process.exit(0)));
