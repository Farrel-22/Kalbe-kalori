const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    await page.setViewport({ width: 1300, height: 1000 });
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: '/Users/hendrasyah/.gemini/antigravity-ide/brain/eb751f68-b21b-4903-96e2-3374b38024df/screenshot_new_ui_fixed.png' });
    await browser.close();
})();
