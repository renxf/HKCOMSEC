import fetch from 'node-fetch';

(async () => {
    try {
      const res = await fetch('https://api.opencorporates.com/v0.4/companies/search?q=MapKing&jurisdiction_code=hk');
      const data = await res.json();
      const results = data.results.companies.map(c => c.company.name);
      console.log('API results MapKing:', results);

      const res2 = await fetch('https://api.opencorporates.com/v0.4/companies/search?q=Linkagent&jurisdiction_code=hk');
      const data2 = await res2.json();
      const results2 = data2.results.companies.map(c => c.company.name);
      console.log('API results Linkagent:', results2);
      
    } catch(e) {
      console.error(e.message);
    }
})();
