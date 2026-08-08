const { chromium } = require('playwright');

const seeds = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;
  const perSeed = {};

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Grab every table cell's text content on the page
    const numbers = await page.$$eval('table td, table th', (cells) =>
      cells
        .map((c) => c.textContent.trim())
        .filter((t) => t.length > 0 && !isNaN(Number(t)))
        .map(Number)
    );

    const seedTotal = numbers.reduce((a, b) => a + b, 0);
    perSeed[seed] = seedTotal;
    grandTotal += seedTotal;

    console.log(`Seed ${seed}: ${numbers.length} numbers, subtotal = ${seedTotal}`);
  }

  console.log('--- Per-seed totals ---');
  console.log(JSON.stringify(perSeed, null, 2));
  console.log(`GRAND TOTAL (all seeds): ${grandTotal}`);

  await browser.close();
})();
