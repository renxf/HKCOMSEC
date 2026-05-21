import puppeteer from 'puppeteer';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Intercept network requests
    page.on('request', request => {
      if (request.url().includes('foreign/search')) {
        console.log('API Request:', request.method(), decodeURIComponent(request.url()));
      }
    });

    await page.goto('https://data.cr.gov.hk/searchResultForeign?lang=en', { waitUntil: 'networkidle0' });
    
    // dump options
    await page.click('#item');
    await new Promise(r => setTimeout(r, 1000));
    const items = await page.$$('.ant-select-item-option-content');
    for (const item of items) {
        const text = await page.evaluate(el => el.innerText, item);
        console.log("Option:", text);
        if (text === 'Company Name' || text === 'Non-Hong Kong Company Name') {
            await item.click();
            break;
        }
    }
    
    // select 'like' or 'begins_with'
    await page.click('#filter');
    await new Promise(r => setTimeout(r, 1000));
    const filters = await page.$$('.ant-select-item-option-content');
    for (const filter of filters) {
        const text = await page.evaluate(el => el.innerText, filter);
        if (text === 'Begins with' || text === 'begins_with') {
            await filter.click();
            break;
        }
    }

    await page.type('#inputvalue', 'ALIBABA');
    await page.click('#get_result');
    
    await new Promise(r => setTimeout(r, 3000));

  } catch (e) {
    console.error(e.message);
  } finally {
    if (browser) await browser.close();
  }
})();
