
const { getQueryDateTime, fuzzySearch } = require('../../utils');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Employee,
  Order,
} = require('../../models');

module.exports = {
  question13: async (req, res, next) => {
    try {
      let { address } = req.query;

      let results = await Order.aggregate()
        .lookup({
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        })
        .unwind('customer')
        .match({
          'customer.address': fuzzySearch(address),
        })
        // .match({
        //   'customer.address': {
        //     $regex: new RegExp(`${address}`),
        //     $options: 'i',
        //   },
        // })
        .project({
          customerId: 0,
          employeeId: 0,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question15: async (req, res, next) => {
    try {
      let { supplierNames } = req.query;

      let conditionFind = {
        name: { $in: supplierNames },
      };

      let results = await Supplier.find(conditionFind);

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question16a: async (req, res, next) => {
    try {
      let results = await Order.find().populate('customer').populate('employee');

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question16b: async (req, res, next) => {
    try {
      let results = await Order.aggregate()
      .lookup({
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'customers',
      })
      .unwind('customers')
      .lookup({
        from: 'employees',
        localField: 'employeeId',
        foreignField: '_id',
        as: 'employees',
      })
      .unwind('employees');

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question18a: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: 'products',
          localField: '_id', // TRUY VẤN NGƯỢC!!!
          foreignField: 'categoryId',
          as: 'products',
        })
        // .unwind('products') // sẽ dẫn dến thiếu dự liệu trừ trường hợp chắc chắn có 1 hoặc nhiều products
        .unwind({
          path: '$products',
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          totalStock: {
            $sum: '$products.stock',
          },
          // totalProduct1: {
          //   $sum: 1,
          // }
          totalProduct: {
            $sum: {
              $cond: {
                if: {
                  $gt: ['$products.stock', 0]
                  // $and: [
                  //   { $gt: ['$products.stock', 0] },
                  //   { $lte: ['$products.stock', 100] },
                  // ]
                }, then: 1, else: 0
              }
            },
          },
        })
        .sort({
          totalProduct: -1,
          totalStock: -1,
          name: -1,
        });

      let total = await Category.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question19: async (req, res, next) => {
    try {
      let results = await Supplier.aggregate()
        .lookup({
          from: 'products',
          localField: '_id',
          foreignField: 'supplierId',
          as: 'products',
        })
        .unwind({
          path: '$products',
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: '$_id',
          name: { $first: '$name' },
          totalProduct: {
            $sum: '$products.stock',
          },
          // count: {$cond: { if: {$gt: ['$products', 0]}, then: 1, else: 0} }
          // count: {
          //   $sum: {$cond: { if: {
          //     $and : [
          //       {$lt: ['$products.stock', 100]},
          //       {$gt: ['$products.stock', 0]},
          //     ]
          //   }, then: 1, else: 0} },
          // },
        })
        .sort({
          totalProduct: -1,
          name: 1,
        });

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question20: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match({
          ...conditionFind,
          status: { $in: ['WAITING'] },
        })
        .unwind('productList')
        .group({
          _id: '$productList.productId',
          quantity: { $sum: '$productList.quantity' },
        })
        .lookup({
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        })
        .unwind("product")
        .project({
          name: '$product.name',
          price: '$product.price',
          discount: '$product.discount',
          stock: '$product.stock',
          quantity: 1,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question20a: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match({
          ...conditionFind,
          status: { $in: ['WAITING'] },
        })
        .unwind('productList')
        .lookup({
          from: 'products',
          localField: 'productList.productId',
          foreignField: '_id',
          as: 'product',
        })
        .project({
          createdDate: 0,
          shippedDate: 0,
          customerId: 0,
          employeeId: 0,
          createdAt: 0,
          updatedAt: 0,
        })
        .unwind('product')
        .group({
          _id: '$product._id',
          // _id: '$productList.product._id',
          name: { $first: '$product.name' },
          price: { $first: '$product.price' },
          discount: { $first: '$product.discount' },
          stock: { $first: '$product.stock' },
          totalQuantity: { $sum: '$productList.quantity' },
          inBill: { $sum: 1 },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question21: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .lookup({
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        })
        .unwind('customer')
        .group({
          _id: '$customer._id',
          firstName: { $first: '$customer.firstName' },
          lastName: { $first: '$customer.lastName' },
          email: { $first: '$customer.email' },
          phoneNumber: { $first: '$customer.phoneNumber' },
          address: { $first: '$customer.address' },
          birthday: { $first: '$customer.birthday' },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question22: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        // .unwind({
        //   path: '$productList',
        //   preserveNullAndEmptyArrays: true,
        // })
        .unwind('productList')
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  '$productList.price',
                  { $subtract: [100, '$productList.discount'] },
                  '$productList.quantity',
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$customerId',
          totalMoney: { $sum: '$total' },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question23: async (req, res, next) => {
    try {
      // let { fromDate, toDate } = req.query;
      // const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        // .match(conditionFind)
        .unwind({
          path: '$productList',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $divide: [
              {
                $multiply: [
                  '$productList.price',
                  { $subtract: [100, '$productList.discount'] },
                  '$productList.quantity',
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          total: { $sum: '$total' },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question24: async (req, res, next) => {
    try {
      // let { fromDate, toDate } = req.query;
      // const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Employee.aggregate()
        // .match(conditionFind)
        .lookup({
          from: 'orders',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'orders',
        })
        // .unwind('orders')
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        // .unwind('orders.productList')
        .unwind({
          path: '$orders.productList',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          "total": {
            $divide: [
              {
                $multiply: [
                  '$orders.productList.price',
                  { $subtract: [100, '$orders.productList.discount'] },
                  '$orders.productList.quantity',
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$_id',
          firstName: { $first: '$firstName'},
          lastName: { $first: '$lastName'},
          phoneNumber: { $first: '$phoneNumber'},
          email: { $first: '$email'},
          total: { $sum: '$total' },
        })
        // .project({
        //   totalPrice: '$total',
        //   firstName: '$employee.firstName',
        //   lastName: '$employee.lastName',
        //   phoneNumber: '$employee.phoneNumber',
        //   address: '$employee.address',
        //   email: '$employee.email ',
        // })

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // SAI
  question24a: async (req, res, next) => {
    try {
      // let { fromDate, toDate } = req.query;
      // const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        // .match(conditionFind)
        .unwind({
          path: '$orderDetails',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    '$orderDetails.price',
                    { $subtract: [100, '$orderDetails.discount'] },
                    '$orderDetails.quantity',
                  ],
                },
                100,
              ],
            },
          },
        })
        .group({
          _id: '$employeeId',
          total: { $sum: '$total' },
        })
        .lookup({
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        })
        .unwind('employee')
        .project({
          totalPrice: '$total',
          firstName: '$employee.firstName',
          lastName: '$employee.lastName',
          phoneNumber: '$employee.phoneNumber',
          address: '$employee.address',
          email: '$employee.email ',
        })

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question25: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: 'orders',
          localField: '_id',
          foreignField: 'productList.productId',
          as: 'orders',
        })
        .match({
          orders: { $size: 0 },
        })
        .project({
          name: 1,
          price: 1,
          stock: 1,
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
