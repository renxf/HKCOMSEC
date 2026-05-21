import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

(async () => {
  try {
    const query = '"阿里巴巴" site:opencorporates.com/companies/hk';
    const res = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const text = await res.text();
    const $ = cheerio.load(text);
    const results = [];
    $('.algo').each((i, el) => {
       const snip = $(el).find('.compText').text();
       const title = $(el).find('h3.title').text().trim();
       results.push(title + ' | ' + snip);
    });
    console.log("Yahoo hits:", results);
  } catch(e){
    console.error(e);
  }
})();
