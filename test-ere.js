import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.eregistry.gov.hk/', { waitUntil: 'networkidle2' });
    const finalUrl = page.url();
    console.log('Final URL eregistry:', finalUrl);
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
