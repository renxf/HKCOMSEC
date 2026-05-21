import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.icris.cr.gov.hk/csci/', { waitUntil: 'networkidle2' });
    const html = await page.content();
    fs.writeFileSync('dom2.html', html);
    console.log('DOM2 saved');
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
