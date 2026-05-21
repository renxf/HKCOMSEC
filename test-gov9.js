import fetch from 'node-fetch';

(async () => {
    try {
      const res = await fetch('https://data.gov.hk/en-data/api/3/action/package_show?id=hk-cr-crdata-list-newly-registered-companies-2324');
      const data = await res.json();
      console.log('package description:', data.result.notes);
      console.log('resources count:', data.result.resources.length);
      data.result.resources.forEach(r => console.log(r.name, r.url));
    } catch (e) {
      console.error(e.message);
    }
})();
