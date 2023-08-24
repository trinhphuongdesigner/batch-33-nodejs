var express = require('express');
var router = express.Router();
const yup = require('yup');

let data = [
  { id: 1, name: 'iPhone 14 Pro Max', price: 1500 },
  { id: 2, name: 'iPhone 13 Pro Max', price: 1200 },
  { id: 3, name: 'iPhone 12 Pro Max', price: 1000 },
  { id: 4, name: 'iPhone 11 Pro Max', price: 800 },
  { id: 9, name: 'iPhone X', price: 500 },
];

const writeFileSync = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data), function (err) {
    if (err) {
      console.log('««««« err »»»»»', err);
      throw err
    };
    console.log('Saved!');
  });
};

const generationID = () => Math.floor(Date.now());

const validateSchema = (schema) => async (req, res, next) => { // thực thi việc xác thực
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    },
      {
        abortEarly: false,
      },
    );

    return next();
  } catch (err) {
    console.log('««««« err »»»»»', err);
    return res.status(400).json({ type: err.name, errors: err.errors, provider: "YUP" });
  }
};

const checkIdSchema = yup.object({
  params: yup.object({
    id: yup.number(),
  }),
});

// Read list product
router.get('/list', function (req, res, next) {
  try {
    return res.send(data);
  } catch (error) {
    console.log('««««« error »»»»»', error);
    return res.send(400, { message: "Không thành công" });
  }
});

// Read detail product
router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  console.log('««««« req.params »»»»»', req.params);

  // const validationSchema = yup.object().shape({
  //   id: yup.number().min(0).max(100),
  // });

  const validationSchema = yup.object({
    params: yup.object({
      id: yup.number().min(0).max(100),
    }),
    query: yup.object({
      price: yup.number().min(0),
    }),
    body: yup.object({
      id: yup.number().min(0).max(100),
      name: yup.string().min(5),
      price: yup.number(),
    }),
  });

  validationSchema
    .validate(
      {
        params: req.params,
        body: req.body,
        query: req.query,
      },
      {
        abortEarly: false,
      },
    )
    .then(() => {
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
    })
    .catch((err) => {
      console.log('««««« err »»»»»', err);
      return res.send(
        404,
        {
          errors: err.errors,
        },
      );
    });
});

router.post('/', function (req, res, next) {
  const { id, name, price } = req.body;

  data = [
    ...data,
    { id, name, price },
  ];

  return res.send(
    202,
    {
      message: "Tạo sản phẩm thành công",
      payload: { id, name, price },
    },
  );
});

router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { name, price } = req.body;

  data = data.map((item) => {
    if (item.id === +id) {
      return {
        id: item.id,
        name,
        price,
      };
    }

    return item;
  })

  return res.send(
    202,
    {
      message: "Cập nhật sản phẩm thành công",
      payload: data,
    },
  );
});

router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const { name, price } = req.body;

  data = data.map((item) => {
    if (item.id === +id) {
      return {
        ...item,
        name: name || item.name,
        price: price || item.price,
      };
    }

    return item;
  })

  return res.send(
    202,
    {
      message: "Cập nhật sản phẩm thành công",
      payload: data,
    },
  );
});

router.delete('/:id', function (req, res, next) {
  const { id } = req.params;

  data = data.filter((item) => item.id !== +id)

  return res.send(
    202,
    {
      message: "Xóa sản phẩm thành công",
      payload: data,
    },
  );
});

module.exports = router;
