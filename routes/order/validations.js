const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  // getSchema: yup.object({
  //   query: yup.object({
  //     category: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
  //       if (!value) return true;
  //       return ObjectId.isValid(value);
  //     }),
  //     sup: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
  //       if (!value) return true;
  //       return ObjectId.isValid(value);
  //     }),
  //     productName: yup.string(),
  //     stockStart: yup.number().min(0),
  //     stockEnd: yup.number(),
  //     priceStart: yup.number().min(0),
  //     priceEnd: yup.number(),
  //     discountStart: yup.number().min(0),
  //     discountEnd: yup.number().max(50),
  //     skip: yup.number(),
  //     limit: yup.number(),
  //   }),
  // }),

  getDetailSchema: yup.object({
    params: yup.object({
      id: yup.string().test('validationID', 'ID sai định dạng', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),

  updateStatusSchema: yup.object({
    body: yup.object({
      // status: yup.string().test('validationStatus', 'Trạng thái không hợp lệ', (value) => {
      //     if (['WAITING', 'COMPLETED', 'CANCELED', 'REJECTED', 'DELIVERING'].includes(value)) {
      //       return true;
      //     }
      //     return false;
      // }),
      status: yup.string()
        .required()
        .oneOf(['WAITING', 'COMPLETED', 'CANCELED', 'REJECTED', 'DELIVERING'], 'Trạng thái không hợp lệ'),

    }),
  }),

  createSchema: yup.object({
    body: yup.object({
      createdDate: yup.date(),

      shippedDate: yup
        .date()
        .test('check date', '${path} ngày tháng không hợp lệ', (value) => {
          if (!value) return true;

          if (value && this.createdDate && value < this.createdDate) {
            return false;
          }

          if (value < new Date()) {
            return false;
          }

          return true;
        }),

      paymentType: yup.string()
        .required()
        .oneOf(['CASH', 'CREDIT_CARD'], 'Phương thức thanh toán không hợp lệ'),

      status: yup.string()
        .required()
        .oneOf(['WAITING', 'COMPLETED', 'CANCELED'], 'Trạng thái không hợp lệ'),

      customerId: yup
        .string()
        .test('validationCustomerID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),

      employeeId: yup
        .string()
        .test('validationEmployeeID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),

      productList: yup.array().of(
        yup.object().shape({
          productId: yup
            .string()
            .test('validationProductID', 'ID sai định dạng', (value) => {
              return ObjectId.isValid(value);
            }),

          quantity: yup.number().required().min(0),

          // price: yup.number().required().min(0),

          // discount: yup.number().required().min(0),
        }),
      ),
    }),
  }),

  updateShippingDateSchema: yup.object({
    body: yup.object({
      shippedDate: yup
        .date()
        .test('check date', '${path} ngày tháng không hợp lệ', (value) => {
          if (!value) return true;

          if (value && this.createdDate && value < this.createdDate) {
            return false;
          }

          if (value < new Date()) {
            return false;
          }

          return true;
        }),
    }),
  }),

  updateEmployeeSchema: yup.object({
    body: yup.object({
      employeeId: yup
        .string()
        .test('validationEmployeeID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  }),
};
