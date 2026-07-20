const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  // Strip query string (e.g. cache-busting ?v=2) before resolving the file
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  
  // Prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File Not Found');
      } else {
        res.statusCode = 500;
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Add Cache-Control header for static assets
      const cacheStaticTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/x-icon'];
      if (cacheStaticTypes.includes(contentType)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      } else {
        res.setHeader('Cache-Control', 'no-cache'); // Don't cache HTML directly, or use a shorter time
      }

      res.setHeader('Content-Type', contentType);

      // Apply compression
      const compressTypes = ['text/html', 'text/css', 'text/javascript', 'application/json', 'image/svg+xml'];
      const acceptEncoding = req.headers['accept-encoding'] || '';

      if (compressTypes.includes(contentType)) {
        if (acceptEncoding.match(/\bbr\b/)) {
          res.setHeader('Content-Encoding', 'br');
          res.writeHead(200);
          return res.end(zlib.brotliCompressSync(content));
        } else if (acceptEncoding.match(/\bgzip\b/)) {
          res.setHeader('Content-Encoding', 'gzip');
          res.writeHead(200);
          return res.end(zlib.gzipSync(content));
        } else if (acceptEncoding.match(/\bdeflate\b/)) {
          res.setHeader('Content-Encoding', 'deflate');
          res.writeHead(200);
          return res.end(zlib.deflateSync(content));
        }
      }

      res.writeHead(200);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
