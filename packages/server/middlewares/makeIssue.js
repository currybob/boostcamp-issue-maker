const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

module.exports = async function makeIssue(id, pw, day, agent) {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', `--user-agent="${agent}"`],
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
  await page.goto(`https://github.com/connect-foundation/day${day}-challenge`);

  const checkPoints = await page.evaluate(() => {
    const el = document.querySelector('#user-content-피어-컴파일링-체크포인트');
    return el.parentNode.nextElementSibling.textContent;
  });

  const issues = checkPoints
    .replace(/\d+\../gi, '')
    .replace(/[^a-z가-힣0-9\n]/gi, ' ')
    .split('\n')
    .filter(issue => issue)
    .map(issue => issue.replace(/\s+/g, ' ').trim());

  await page.goto(`https://github.com/${id}/day${day}-challenge/settings`);

  const checkbox = await page.$('#issue-feature');
  const checked = await (await checkbox.getProperty('checked')).jsonValue();

  if (!checked) {
    await checkbox.click();
    await page.waitFor(2000);
  }

  for (let issue of issues) {
    await page.goto(`https://github.com/${id}/day${day}-challenge/issues/new`);
    await page.focus('#issue_title');
    await page.keyboard.type(issue);
    await page.focus('.new_issue button[type="submit"]');
    await page.keyboard.press('Enter');
    await page.waitFor(3000);
  }

  await browser.close();
};
