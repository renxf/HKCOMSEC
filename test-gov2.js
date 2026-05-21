import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('https://data.gov.hk/en-data/api/3/action/package_search?q=companies+registry+index');
    const data = await res.json();
    for (const r of data.result.results.slice(0, 10)) {
       console.log(r.name);
    }
  } catch (e) {
    console.error(e);
  }
})();
