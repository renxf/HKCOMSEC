import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('https://api.opencorporates.com/v0.4/companies/search?q=Vanguard&jurisdiction_code=hk');
    const text = await res.text();
    console.log(text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
})();
