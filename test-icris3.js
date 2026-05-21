import puppeteer from 'puppeteer';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.e-services.cr.gov.hk/ICRIS3EP/system/home.do', { waitUntil: 'networkidle2' });
    const html = await page.content();
    console.log(html.substring(0, 1000));
    console.log("length:", html.length);
  } catch (e) {
    console.error(e.message);
  } finally {
    if (browser) await browser.close();
  }
})();
