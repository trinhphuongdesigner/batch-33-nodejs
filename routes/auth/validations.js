const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  createSchema: yup.object({
    body: yup.object({
      firstName: yup.string().required().max(50, 'Họ được vượt quá 50 ký tự'),

      lastName: yup.string().required().max(50, 'Tên được vượt quá 50 ký tự'),

      email: yup.string()
        .required()
        // .email()
        .test('email type', '${path} Không phải email hợp lệ', (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

      phoneNumber: yup.string()
        .required()
        .test('phoneNumber type', '${path} Không phải số điện thoại hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),

      address: yup.string()
        .required()
        .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),

      birthday: yup.date(),

      password: yup.string()
        .required()
        .min(3, 'Không được ít hơn 3 ký tự')
        .max(12, 'Không được vượt quá 12 ký tự'),
    }),
  }),

  loginSchema: yup.object({
    body: yup.object({
      email: yup.string()
        .required()
        .email(),
        // .test('email type', '${path} Không phải email hợp lệ', (value) => {
        //   const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        //   return emailRegex.test(value);
        // }),

      password: yup.string()
        .required()
        .min(3, 'Không được ít hơn 3 ký tự')
        .max(12, 'Không được vượt quá 12 ký tự'),
    }),
  }),
};