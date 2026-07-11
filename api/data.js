const https = require('https');

module.exports = (req, res) => {
    const targetPath = req.query.path || 'leaderboard-league.php';
    const targetUrl = 'https://event.cause.id/kalbedonorkalori/' + targetPath;

    https.get(targetUrl, (proxyRes) => {
        res.status(proxyRes.statusCode);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        proxyRes.pipe(res);
    }).on('error', (err) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy failed' });
    });
};
