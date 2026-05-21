import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://opencorporates.com/companies/hk?q=MapKing', { waitUntil: 'networkidle2' });
    const html = await page.content();
    const $ = cheerio.load(html);
    const companies = [];
    $('.companies li.search-result').each((i, el) => {
       const name = $(el).find('.company_search_result').text().trim();
       if (name) companies.push(name.replace(/\n\s+/g, ' '));
    });
    console.log('MapKing Found:', companies.slice(0, 5));
    if (companies.length === 0) {
      console.log('Page content length:', html.length);
      console.log('Is it blocked?', html.includes('Challenge') || html.includes('captcha') || html.includes('Cloudflare') || html.includes('HAProxy'));
    }
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
