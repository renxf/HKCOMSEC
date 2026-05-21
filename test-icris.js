import puppeteer from 'puppeteer';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    console.log('Navigating to login...');
    await page.goto('https://www.e-services.cr.gov.hk/ICRIS3EP/system/home.do', { waitUntil: 'networkidle0' });
    
    console.log('Login HTML title:', await page.title());
    // Find unregistered user login link
    // The link is usually something like javascript:document.loginForm.submit() or similar
    // Let's just dump the HTML of login area to understand where to click
    const html = await page.content();
    console.log('Unregistered user button presence:', html.includes('Unregistered User'));

    // take a screenshot maybe? We can't view it easily. 
    // Let's do a cheerio parse of links
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const links = [];
    $('a').each((i, el) => {
        links.push({ text: $(el).text().trim(), href: $(el).attr('href') });
    });
    console.log('Links:', links.filter(l => l.text.includes('Unregistered')));

  } catch (e) {
    console.error(e.message);
  } finally {
    if (browser) await browser.close();
  }
})();
