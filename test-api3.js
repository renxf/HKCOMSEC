import fetch from 'node-fetch';

(async () => {
    try {
      const res = await fetch('https://api.opencorporates.com/v0.4/companies/search?q=MapKing&jurisdiction_code=hk');
      const text = await res.text();
      console.log('API output:', text.substring(0, 1000));
    } catch(e) {
      console.error(e.message);
    }
})();
