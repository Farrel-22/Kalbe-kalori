const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // API Proxy Route
    if (req.url.startsWith('/api/data')) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const targetPath = urlObj.searchParams.get('path') || 'leaderboard-league.php';
        const targetUrl = 'https://event.cause.id/kalbedonorkalori/' + targetPath;
        
        https.get(targetUrl, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            proxyRes.pipe(res);
        }).on('error', (err) => {
            console.error('Proxy Error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Proxy failed' }));
        });
        return;
    }

    // Static File Server
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`API Proxy running at http://localhost:${PORT}/api/data`);
});
