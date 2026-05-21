import fetch from 'node-fetch';

(async () => {
  try {
    const query = 'vanguard site:opencorporates.com/companies/hk';
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await res.text();
    console.log(text.substring(0, 500));
  } catch (e) {
    console.error(e.message);
  }
})();
