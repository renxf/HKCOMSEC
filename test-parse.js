import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('webb.html', 'utf-8');
const $ = cheerio.load(html);
const rows = $('table.numtable tr');
rows.each((i, row) => {
  if (i === 0) return; // header
  const name = $(row).find('td').eq(0).text().trim();
  console.log(i, name);
});
