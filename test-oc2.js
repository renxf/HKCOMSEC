import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://opencorporates.com/companies/hk?q=vanguard', { waitUntil: 'networkidle2' });
    const html = await page.content();
    console.log(html.substring(0, 800));
    console.log(html.includes('search-result') ? 'Has results' : 'No results class');
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
