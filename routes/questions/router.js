const express = require('express');
const router = express.Router();

const {
  question1,
  question1a,
  question1b,
  question2,
  question2a,
  question2b,
  question3,
  question3a,
  question3c,
  question3d,
  question3e,
  question4,
  question4a,
  question5,
  question5a,
  question6,
  question7,
  question7a,
  question8a,
  question8b,
  question8c,
} = require('./controller');

const {
  question13,
  question15,
  question16a,
  question16b,
  question18a,
  question19,
  question20,
  question21,
  question22,
  question23,
  question24,
  question25,
} = require('./controller2');

const {
  question26,
  question26b,
  question26c,
  question27,
  question29,
  question30,
  question34,
} = require('./controller3');

router.get('/1', question1);
router.get('/1a', question1a);
router.get('/1b', question1b);
router.get('/2', question2);
router.get('/2a', question2a);
router.get('/2b', question2b);
router.get('/3', question3);
router.get('/3a', question3a);
router.get('/3c', question3c);
router.get('/3d', question3d);
router.get('/3e', question3e);
router.get('/4', question4);
router.get('/4a', question4a);
router.get('/5', question5);
router.get('/5a', question5a);
router.get('/6', question6);
router.get('/7', question7);
router.get('/7a', question7a);
router.get('/8a', question8a);
router.get('/8b', question8b);
router.get('/8c', question8c);
router.get('/13', question13);
router.get('/15', question15);
router.get('/16a', question16a);
router.get('/16b', question16b);
router.get('/18a', question18a);
router.get('/19', question19);
router.get('/20', question20);
router.get('/21', question21);
router.get('/22', question22);
router.get('/23', question23);
router.get('/24', question24);
router.get('/25', question25);
router.get('/26', question26);
router.get('/26b', question26b);
router.get('/26c', question26c);
router.get('/27', question27);
router.get('/29', question29);
router.get('/30', question30);
router.get('/34', question34);

module.exports = router;
