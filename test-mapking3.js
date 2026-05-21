import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

(async () => {
    let query = '"mapking" site:opencorporates.com/companies/hk';
    let res = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    let text = await res.text();
    let $ = cheerio.load(text);
    let results = [];
    $('.algo').each((i, el) => {
       const title = $(el).find('h3.title').text().trim();
       const snip = $(el).find('.compText').text().trim();
       results.push({title, snip});
    });
    console.log("Yahoo hits tight:", results);
})();
