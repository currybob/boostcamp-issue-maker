const express = require('express');
const router = express.Router();
const makeIssue = require('../middlewares/makeIssue');
const closeIssue = require('../middlewares/closeIssue');
const { doAsync } = require('../utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post(
  '/',
  doAsync(async (req, res) => {
    try {
      const { id, pw, day, agent } = req.body;
      console.log(agent);
      await makeIssue(id, pw, day, agent);

      res.status(201).json({ success: true, message: '이슈가 정상적으로 등록되었습니다.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }),
);

router.put(
  '/',
  doAsync(async (req, res) => {
    try {
      const { id, pw, day, agent } = req.body;
      await closeIssue(id, pw, day, agent);
      res.status(200).json({ success: true, message: '이슈가 모두 닫혔습니다.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }),
);

module.exports = router;
