import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

(async () => {
    const q = '"Mapking" "Hong Kong"';
    const yRes = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const yHtml = await yRes.text();
    const $ = cheerio.load(yHtml);
    let count = 0;
    $('.algo').each((_, el) => {
        count++;
    });
    console.log("Hits:", count);
})();
