import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://webb-site.com/dbpub/orgsearch.asp?pt=&t=1&n=vanguard', { waitUntil: 'networkidle2' });
    const html = await page.content();
    fs.writeFileSync('webb.html', html);
    console.log('webb.html saved');
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
