import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('https://www.mobile-cr.gov.hk/');
    const text = await res.text();
    console.log(text.substring(0, 500));
  } catch (e) {
    console.error(e.message);
  }
})();
