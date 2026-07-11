const https = require('http');

https.get('http://event.cause.id/kalbedonorkalori/leaderboard?t=league', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Total bytes:", data.length);
    console.log("Data snippet:", data.substring(0, 500));
    const fs = require('fs');
    fs.writeFileSync('page.html', data);
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
