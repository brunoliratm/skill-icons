const http = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const icons = require('./api/icons');

const types = {
  'index.html': 'text/html; charset=utf-8',
  'app.js': 'text/javascript',
  'style.css': 'text/css',
  'catalog.json': 'application/json',
  'wordmark.svg': 'image/svg+xml',
  'favicon.ico': 'image/x-icon',
};
const port = Number(process.env.PORT || 4173);
http
  .createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/api/icons') {
      res.status = code => {
        res.statusCode = code;
        return res;
      };
      res.send = body => res.end(body);
      res.json = value => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(value));
      };
      return icons(req, res);
    }
    if (pathname === '/api' || pathname === '/api/') {
      res.writeHead(307, { Location: '/' }).end();
      return;
    }
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!Object.hasOwn(types, file)) return res.writeHead(404).end();
    try {
      const body = await readFile(path.join(__dirname, 'dist', file));
      res.writeHead(200, { 'Content-Type': types[file] }).end(body);
    } catch {
      res.writeHead(500).end('Run npm run build first.');
    }
  })
  .listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/`));
