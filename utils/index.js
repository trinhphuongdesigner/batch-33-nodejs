const yup = require('yup');
const fs = require('fs');

module.exports = {
  writeFileSync: (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data), function (err) {
      if (err) {
        console.log('««««« err »»»»»', err);
        throw err
      };
      console.log('Saved!');
    });
  },

  generationID: () => Math.floor(Date.now()),

  validateSchema: (schema) => async (req, res, next) => { // thực thi việc xác thực
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
  },

  checkIdSchema: yup.object({
    params: yup.object({
      id: yup.number().min(0),
    }),
  }),

  checkCreateSchema: yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().min(0).required(),
    }),
  }),
};
