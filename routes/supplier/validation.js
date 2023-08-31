const yup = require('yup');

const supplierSchema = yup.object({
  body: yup.object({
    name: yup.string()
      .max(50, "Tên quá dài")
      .required("Không được bỏ trống"),

    email: yup.string()
      .email()
      .max(50, "Email quá dài")
      .required("Không được bỏ trống"),

    phoneNumber: yup.string()
      .max(50, "Tên quá dài")
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại sai rồi')
      .required("Không được bỏ trống"),

    address: yup.string()
      .max(300, "Địa chỉ quá dài")
      .required("Không được bỏ trống"),
  }),
});

const supplierPatchSchema = yup.object({
  body: yup.object({
    name: yup.string()
      .max(50, "Tên quá dài"),

    email: yup.string()
      .email()
      .max(50, "Email quá dài"),

    phoneNumber: yup.string()
      .max(50, "Tên quá dài")
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại sai rồi'),

    address: yup.string()
      .max(300, "Địa chỉ quá dài"),
  }),
});

module.exports = {
  supplierSchema,
  supplierPatchSchema,
}