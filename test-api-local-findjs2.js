import fetch from 'node-fetch';

(async () => {
    try {
        const res = await fetch('https://data.cr.gov.hk/static/js/bundle.js');
        const text = await res.text();
        const urls = text.match(/api_builder\/[a-zA-Z0-9_\/]+/g);
        if (urls) {
           console.log([...new Set(urls)]);
        }
    } catch (e) {
        console.error(e.message);
    }
})();
