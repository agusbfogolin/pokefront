// Servidor local mínimo para Pokémon Frontera (sin dependencias). Sirve la carpeta dist/.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.png':'image/png','.xml':'application/xml','.woff2':'font/woff2','.md':'text/markdown; charset=utf-8',
  '.txt':'text/plain; charset=utf-8','.zip':'application/zip','.svg':'image/svg+xml','.ico':'image/x-icon'};

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(root, '.' + rel);
  if (!file.startsWith(root)) { res.writeHead(403).end('Prohibido'); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404).end('No encontrado'); return; }
    res.writeHead(200, {'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
    fs.createReadStream(file).pipe(res);
  });
});

function listen(port) {
  server.once('error', e => { if (e.code === 'EADDRINUSE' && port < 8140) listen(port + 1); else { console.error(e.message); process.exit(1); } });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}/`;
    console.log('\n  POKEMON FRONTERA en marcha: ' + url);
    console.log('  Deja esta ventana abierta mientras juegas. Ciérrala para detener el servidor.\n');
    if (!process.argv.includes('--no-open')) exec(process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`);
  });
}
listen(8123);
