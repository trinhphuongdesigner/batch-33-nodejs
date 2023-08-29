const yup = require('yup');

module.exports = {
  checkCreateCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().required(),
      description: yup.string().min(0).required(),
    }),
  }),
};
