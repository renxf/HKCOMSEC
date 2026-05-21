import fetch from 'node-fetch';

(async () => {
    try {
      const res = await fetch('https://data.gov.hk/en-data/api/3/action/package_search?q=companies+OR+registry');
      const data = await res.json();
      console.log('Total results:', data.result.count);
      for (const r of data.result.results.slice(0, 10)) {
         console.log(r.name, r.title);
         if (r.resources && r.resources.length > 0) {
             console.log("  first resource URL:", r.resources[0].url);
         }
      }
    } catch (e) {
      console.error(e.message);
    }
})();
