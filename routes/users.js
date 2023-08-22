var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function(req, res, next) {
  const { id } = req.params;
  console.log('««««« req.query »»»»»', req.query);
  res.send(`respond with a resource of user: ${id}`);
});

module.exports = router;
