import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    console.log('Navigating to login...');
    await page.goto('https://www.e-services.cr.gov.hk/ICRIS3EP/system/home.do', { waitUntil: 'networkidle2' });
    
    console.log('Waiting for Unregistered User button...');
    await page.waitForSelector('a[href*="login.do"]', { timeout: 10000 });
    
    const html = await page.content();
    console.log('HTML partially length:', html.length);
    
    await browser.close();
  } catch (e) {
    console.error(e.message);
  }
})();
