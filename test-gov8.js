import fetch from 'node-fetch';

(async () => {
    try {
      const res = await fetch('https://data.gov.hk/en-data/api/3/action/package_list');
      const data = await res.json();
      const cr = data.result.filter(p => p.includes('company') || p.includes('companies') || p.includes('cr'));
      console.log('CR packages:', cr);
    } catch (e) {
      console.error(e.message);
    }
})();
