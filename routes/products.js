var express = require('express');
var router = express.Router();
const yup = require('yup');
const fs = require('fs');

let data = require('../data/products.json');

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
    return res.send(400, { type: err.name, errors: err.errors, provider: "YUP", })
    // return res.status(400).json({ type: err.name, errors: err.errors, provider: "YUP" });
  }
};

const checkIdSchema = yup.object({
  params: yup.object({
    id: yup.number().min(0),
  }),
});

const checkCreateSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    price: yup.number().min(0).required(),
  }),
});

const sendErr = () => res.send(
  400,
  {
    message: "Thất bại",
  },
);

// Read list product
router.get('/list', function (req, res, next) {
  try {
    return res.send(data);
  } catch (error) {
    console.log('««««« error »»»»»', error);
    return res.send(400, { message: "Không thành công" });
  }
});

// OLD VERSION
// router.get('/:id', function (req, res, next) {
//   const { id } = req.params;
//   console.log('««««« req.params »»»»»', req.params);

//   // const validationSchema = yup.object().shape({
//   //   id: yup.number().min(0).max(100),
//   // });

//   const validationSchema = yup.object({
//     params: yup.object({
//       id: yup.number().min(0).max(100),
//     }),
//     query: yup.object({
//       price: yup.number().min(0),
//     }),
//     body: yup.object({
//       id: yup.number().min(0).max(100),
//       name: yup.string().min(5),
//       price: yup.number(),
//     }),
//   });

//   validationSchema
//     .validate(
//       {
//         params: req.params,
//         body: req.body,
//         query: req.query,
//       },
//       {
//         abortEarly: false,
//       },
//     )
//     .then(() => {
//       const detail = data.find((item) => item.id.toString() === id);

//       if (!detail) {
//         return res.send(
//           404,
//           {
//             message: "Không tìm thấy",
//           },
//         );
//       }

//       return res.send(
//         202,
//         {
//           message: "Lấy thông tin thành công",
//           payload: detail,
//         },
//       );
//     })
//     .catch((err) => {
//       console.log('««««« err »»»»»', err);
//       return res.send(
//         404,
//         {
//           errors: err.errors,
//         },
//       );
//     });
// });

// NEW VERSION

const controller = (req, res, next) => {
  try {
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
  } catch (error) {
    console.log('««««« error »»»»»', error);
    return sendErr();
  }
};

router.get('/:id', validateSchema(checkIdSchema), controller);

router.post('/', validateSchema(checkCreateSchema), function (req, res, next) {
  try {
    const { name, price } = req.body;

    const newP = { id: generationID(), name, price };

    data = [...data, newP];

    writeFileSync("data/products.json", data);

    return res.send(
      202,
      {
        message: "Tạo sản phẩm thành công",
        payload: newP,
      },
    );
  } catch (error) {
    console.log('««««« error »»»»»', error);
    sendErr();
  }
});

router.put('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const updateData = {
      id: +id,
      name,
      price,
    };

    data = data.map((item) => {
      if (item.id === +id) {
        return updateData;
      }

      return item;
    })

    writeFileSync("data/products.json", data);

    return res.send(
      202,
      {
        message: "Cập nhật sản phẩm thành công",
        payload: updateData,
      },
    );
  } catch (error) {
    console.log('««««« error »»»»»', error);
    return sendErr();
  }
});

router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    let updateData = {};

    data = data.map((item) => {
      if (item.id === +id) {
        updateData = {
          ...item,
          name: name || item.name,
          price: price || item.price,
        };

        console.log('««««« updateData »»»»»', updateData);

        return updateData;
      }

      return item;
    });

    writeFileSync("data/products.json", data);

    if (updateData) {
      return res.send(
        202,
        {
          message: "Cập nhật sản phẩm thành công",
          payload: updateData,
        },
      );
    }

    return sendErr();
  } catch (error) {
    console.log('««««« error »»»»»', error);
    return sendErr();
  }
});

router.delete('/:id', function (req, res, next) {
  try {
    const { id } = req.params;

    data = data.filter((item) => item.id !== +id)

    writeFileSync("data/products.json", data);

    return res.send(
      202,
      {
        message: "Xóa sản phẩm thành công",
      },
    );
  } catch (error) {
    console.log('««««« error »»»»»', error);
    return sendErr();
  };
});

module.exports = router;
