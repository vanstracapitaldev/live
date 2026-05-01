const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = path.resolve(__dirname); // serve repo root (contains login.html)

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendResponse(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Server error');
    }

    // Prevent aggressive caching while developing
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });

    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    // map friendly routes like /login -> /login.html
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath = reqPath + 'index.html';

    let filePath = path.join(BASE_DIR, reqPath);

    // If exact file not found, try adding .html
    if (!fs.existsSync(filePath)) {
      if (!path.extname(filePath)) {
        const tryHtml = filePath + '.html';
        if (fs.existsSync(tryHtml)) filePath = tryHtml;
      }
    }

    // If still not found, fallback to index.html
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BASE_DIR, 'index.html');
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
      }
    }

    sendResponse(res, filePath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});
