import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const res = await page.goto('https://www.eregistry.gov.hk/icris-ext/comps/login.do', { waitUntil: 'domcontentloaded' });
    console.log(res.status(), res.url());
    console.log((await page.content()).substring(0, 500));
    await browser.close();
  } catch (e) {
    console.error(e.message);
  }
})();
