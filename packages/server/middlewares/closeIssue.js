const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

module.exports = async function closeIssue(id, pw, day, agent) {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandobox', `--user-agent="${agent}"`],
  });

  const page = await browser.newPage();
  const preloadFile = fs.readFileSync(path.resolve(__dirname, '../utils/preload.js'), 'utf8');

  await page.evaluateOnNewDocument(preloadFile);
  await page.goto(`https://github.com/login`);
  await page.evaluate(
    (id, pw) => {
      document.querySelector('#login_field').value = id;
      document.querySelector('#password').value = pw;
    },
    id,
    pw,
  );

  await page.click('input[type="submit"]');
  await page.goto(`https://github.com/${id}/day${day}-challenge/issues`);

  const issues = await page.$$('input[data-check-all]');

  if (issues.length) {
    const checkbox = await page.$('input[data-check-all]');
    await checkbox.click();
    await page.waitForSelector('.js-issue-triage-menu');
    await page.$eval('.js-issue-triage-menu', e => e.setAttribute('open', true));
    await page.waitForSelector('.js-issue-triage-menu button[value="closed"]');
    await page.$eval('.js-issue-triage-menu button[value="closed"]', btn => btn.click());
  }

  await browser.close();
};
