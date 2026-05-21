import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://webb-site.com/dbpub/orgsearch.asp?p=1&t=1&n=mapking', { waitUntil: 'networkidle2' });
    const html = await page.content();
    
    // Parse using cheerio
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const results = [];
    $('table.numtable tr').each((i, row) => {
      if (i === 0) return; // header
      const name = $(row).find('td').eq(0).text().trim();
      if (name) {
          results.push(name);
      }
    });

    console.log('Webb-site results for mapking:', results);
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
