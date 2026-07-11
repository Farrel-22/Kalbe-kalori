const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.querySelector('#leaderboard-tbody').innerText);
    console.log('TABLE CONTENT:');
    console.log(text.substring(0, 500));
    await browser.close();
})();
