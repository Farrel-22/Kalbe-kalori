const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 1000 });
    
    // Visit local server
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Select weekly-male
    await page.select('#category-select', 'weekly-male');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: '/Users/hendrasyah/.gemini/antigravity-ide/brain/b3d0e051-652b-4ec2-87b8-5c69ee4cad92/weekly_male.png' });
    
    // Select weekly-female
    await page.select('#category-select', 'weekly-female');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: '/Users/hendrasyah/.gemini/antigravity-ide/brain/b3d0e051-652b-4ec2-87b8-5c69ee4cad92/weekly_female.png' });
    
    // Select all-participants
    await page.select('#category-select', 'all-participants');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: '/Users/hendrasyah/.gemini/antigravity-ide/brain/b3d0e051-652b-4ec2-87b8-5c69ee4cad92/all_participants.png' });

    await browser.close();
    console.log("Screenshots captured successfully!");
})();
