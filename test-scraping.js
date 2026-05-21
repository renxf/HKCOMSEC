import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.e-services.cr.gov.hk/wps/portal/cne/', { waitUntil: 'networkidle2' });
    const html = await page.content();
    fs.writeFileSync('dom.html', html);
    console.log('DOM saved to dom.html');
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
