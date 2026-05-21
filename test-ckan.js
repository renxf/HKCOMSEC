import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('https://data.gov.hk/en-data/api/3/action/package_search?q=company-register');
    const data = await res.json();
    for (const r of data.result.results.slice(0, 5)) {
       console.log(r.name, r.title);
       for (const res of r.resources) {
           console.log(' -', res.name, res.id);
       }
    }
  } catch (e) {
    console.error(e);
  }
})();
