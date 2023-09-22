const yup = require('yup');

module.exports = {
  checkCreateCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().required(),
      description: yup.string().max(500),
    }),
  }),

  checkPutCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().max(50).required(),
      description: yup.string().max(500),
    }),
  }),

  checkPatchCategorySchema: yup.object({
    body: yup.object({
      name: yup.string().max(50),
      isDeleted: yup.boolean(),
      description: yup.string().max(500),
    }),
  }),
};
