import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.e-services.cr.gov.hk/wps/portal/cne/', { waitUntil: 'networkidle2' });
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
