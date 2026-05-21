import fetch from 'node-fetch';

(async () => {
    try {
      const res = await fetch('https://data.gov.hk/en-data/api/3/action/package_list');
      const data = await res.json();
      console.log('Total packages:', data.result.length);
      console.log('First 5:', data.result.slice(0, 5));
    } catch (e) {
      console.error(e.message);
    }
})();
