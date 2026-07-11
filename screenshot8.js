const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    await page.setViewport({ width: 1300, height: 1000 });
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const tableHTML = await page.evaluate(() => document.getElementById('leaderboard-tbody')?.innerHTML || 'null');
    console.log('TABLE HTML LENGTH:', tableHTML.length);
    console.log('TABLE HTML PREVIEW:', tableHTML.substring(0, 100));
    await browser.close();
})();
