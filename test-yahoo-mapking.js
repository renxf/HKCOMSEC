import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

(async () => {
    const q = 'mapking site:opencorporates.com/companies/hk';
    const yRes = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const yHtml = await yRes.text();
    const $ = cheerio.load(yHtml);
    const results = [];
    $('.algo').each((_, el) => {
        const title = $(el).find('h3.title').text().trim();
        const snip = $(el).find('.compText').text().trim();
        results.push({title, snip});
    });
    console.log(results);
})();
