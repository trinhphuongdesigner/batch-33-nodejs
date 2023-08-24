var express = require('express');
var router = express.Router();

let data = [
  { id: 1, name: 'iPhone 14 Pro Max', price: 1500 },
  { id: 2, name: 'iPhone 13 Pro Max', price: 1200 },
  { id: 3, name: 'iPhone 12 Pro Max', price: 1000 },
  { id: 4, name: 'iPhone 11 Pro Max', price: 800 },
  { id: 9, name: 'iPhone X', price: 500 },
];

// Read list product
router.get('/list', function(req, res, next) {
  res.send(data);
});

// Read list product
router.get('/:id', function(req, res, next) {
  const { id } = req.params;

  const detail = data.find((item) => item.id.toString() === id);
  if (!detail) {
    return res.send(
      404,
      {
        message: "Không tìm thấy",
      },
    );
  }

  return res.send(
    202,
    {
      message: "Lấy thông tin thành công",
      payload: detail,
    },
  );
});

module.exports = router;
