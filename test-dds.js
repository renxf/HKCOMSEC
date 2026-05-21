import { search } from 'duck-duck-scrape';

(async () => {
  try {
    const searchResults = await search('vanguard site:opencorporates.com/companies/hk');
    console.log(searchResults.results.map(r => r.title));
  } catch (e) {
    console.error(e);
  }
})();
