import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await page.goto('https://data.cr.gov.hk/', { waitUntil: 'networkidle0' });
    const html = await page.content();
    const $ = cheerio.load(html);
    const links = [];
    $('a').each((i, el) => {
        links.push({ text: $(el).text().trim(), href: $(el).attr('href') });
    });
    console.log(links);

  } catch (e) {
    console.error(e.message);
  } finally {
    if (browser) await browser.close();
  }
})();
