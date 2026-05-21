import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

(async () => {
    try {
      const query = '"Mapking" site:opencorporates.com/companies/hk';
      const res = await fetch(`https://www.ecosia.org/search?q=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const text = await res.text();
      const $ = cheerio.load(text);
      const results = [];
      $('.result-title').each((i, el) => {
         results.push($(el).text().trim());
      });
      console.log('Ecosia results:', results);
    } catch(e) {
      console.error(e.message);
    }
})();
