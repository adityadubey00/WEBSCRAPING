import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.amazon.in/s?k=dance&page=4&crid=29AE9JOVEEYD9&qid=1720660100&sprefix=dance%2Caps%2C303&ref=sr_pg_');

  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('.s-main-slot .s-result-item').forEach(item => {
      const name = item.querySelector('h2 .a-link-normal')?.innerText;
      const price = item.querySelector('.a-price .a-offscreen')?.innerText;
      const imgUrl = item.querySelector('.s-image')?.src;

      if (name && price && imgUrl) {
        items.push({ name, price, imgUrl });
      }
    });
    return items;
  });

  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

  await browser.close();
})();
