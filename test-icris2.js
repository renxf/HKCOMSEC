import puppeteer from 'puppeteer';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.e-services.cr.gov.hk/wps/portal/cne/', { waitUntil: 'networkidle2' });
    console.log('Title:', await page.title());
    // Dump all frames
    for (const frame of page.frames()) {
        console.log('Frame url:', frame.url());
        const html = await frame.content();
        console.log('Frame contains Unregistered:', html.includes('Unregistered User'));
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    if (browser) await browser.close();
  }
})();
