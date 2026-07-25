const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('response', async (response) => {
    if (response.url().includes('/users/login') || response.url().includes('/users/register')) {
      console.log('API RESPONSE STATUS:', response.status());
      try {
        console.log('API RESPONSE BODY:', await response.text());
      } catch (e) {}
    }
  });

  try {
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    console.log('Navigated to login page.');
    
    // Type credentials
    await page.type('#identifier', 'testuser');
    await page.type('#password', 'testpassword');
    console.log('Typed credentials.');
    
    // Click submit
    await page.click('button[type="submit"]');
    console.log('Clicked submit.');
    
    // Wait a bit for the request
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (err) {
    console.log('TEST ERROR:', err.message);
  }

  await browser.close();
})();
