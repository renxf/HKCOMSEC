import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://webb-site.com/dbpub/orgsearch.asp?p=1&t=1&n=mapking', { waitUntil: 'networkidle2' });
    const html = await page.content();
    console.log(html.substring(0, 1500));
    console.log(html.includes('MapKing') ? "Has MapKing" : "No MapKing");
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
