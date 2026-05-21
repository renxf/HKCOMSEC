import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

(async () => {
    try {
      const query = 'mapking site:opencorporates.com/companies/hk';
      const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        method: 'POST', // Sometimes POST bypasses simple checks or we can just GET
      });
      const text = await res.text();
      const $ = cheerio.load(text);
      const results = [];
      $('.result__title').each((i, el) => {
         results.push($(el).text().trim());
      });
      console.log('DDG HTML results:', results);
      if (results.length === 0) {
           console.log(text.substring(0, 1000));
      }
    } catch(e) {
      console.error(e.message);
    }
})();
