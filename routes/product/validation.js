const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

const validationSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().max(50, "Tên sản phẩm quá dài").required("Tên không được bỏ trống"),

    price: yup.number().min(0, "Giá không thể âm").integer().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    discount: yup.number().min(0, "Giảm giá không thể âm").max(75, "Giảm giá quá lớn").integer().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    stock: yup.number().min(0, "Số lượng không hợp lệ").integer().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    description: yup.string().max(3000, "Mô tả quá dài").required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    // isDeleted: yup.boolean().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    categoryId: yup.string().required().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),

    supplierId: yup.string().required().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),
  }),
});

const validationQuerySchema = yup.object().shape({
  query: yup.object({
    categoryId: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),

    priceStart: yup.number().min(0).test('Giá không hợp lệ', (value, context) => {
      if (!value) return true; // Không điền giá kết thúc

      if (context.parent.priceEnd) {
        return value < context.parent.priceEnd // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
      };
    }),

    priceEnd: yup.number().min(0).test('Giá không hợp lệ', (value, context) => {
      if (!value) return true; // Không điền giá kết thúc

      if (context.parent.priceStart) {
        return value > context.parent.priceStart; // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
      }
    }),

    page: yup.number().min(1),

    limit: yup.number().min(2),

    supplierId: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),

    keyword: yup.string(),

    stockStart: yup.number().min(0),

    stockEnd: yup.number(),

    discountStart: yup.number().min(0).max(75),

    discountEnd: yup.number().min(0).max(75),
  }),
});

module.exports = {
  validationSchema,
  validationQuerySchema,
}