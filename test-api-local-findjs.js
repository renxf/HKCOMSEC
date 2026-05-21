import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

(async () => {
    try {
        const res = await fetch('https://data.cr.gov.hk/searchResultLocal?lang=en');
        const text = await res.text();
        const $ = cheerio.load(text);
        const scripts = [];
        $('script[src]').each((i, el) => {
            scripts.push($(el).attr('src'));
        });
        console.log("scripts:", scripts);
        
        for (const s of scripts) {
             const u = s.startsWith('http') ? s : 'https://data.cr.gov.hk' + s;
             const sr = await fetch(u);
             const st = await sr.text();
             const urls = st.match(/\/api\/[a-zA-Z0-9_\/]+/g);
             if (urls) {
                 console.log("Found in", s, [...new Set(urls)]);
             }
        }
    } catch (e) {
        console.error(e.message);
    }
})();
