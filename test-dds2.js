import { search } from 'duck-duck-scrape';

(async () => {
  try {
    const searchResults = await search('mapking site:opencorporates.com/companies/hk');
    console.log("Broad search:");
    searchResults.results.forEach(r => console.log(r.title));

    const exactResults = await search('"MapKing" site:opencorporates.com/companies/hk');
    console.log("\nExact search:");
    exactResults.results.forEach(r => console.log(r.title));
  } catch (e) {
    console.error(e);
  }
})();
