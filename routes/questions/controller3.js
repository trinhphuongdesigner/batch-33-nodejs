
const { getQueryDateTime, fuzzySearch } = require('../../utils');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
} = require('../../models');

module.exports = {
  // SAI
  question26: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      fromDate = new Date(fromDate);

      const tmpToDate = new Date(toDate);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      let results = await Product.aggregate()
        .lookup({
          from: 'orders',
          localField: '_id',
          foreignField: 'orderDetails.productId',
          as: 'orders',
        })
      // .unwind({
      //   path: '$orders',
      //   preserveNullAndEmptyArrays: true,
      // })
      // .match({
      //   $or: [
      //     {
      //       $and: [
      //         { orders: { $ne: null } },
      //         {
      //           $or: [
      //             { 'orders.createdDate': { $lte: fromDate } },
      //             { 'orders.createdDate': { $gte: toDate } },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       orders: null,
      //     },
      //   ],
      // })
      // .lookup({
      //   from: 'suppliers',
      //   localField: 'supplierId',
      //   foreignField: '_id',
      //   as: 'suppliers',
      // })
      // .project({
      //   _id: 0,
      //   suppliers: 1,
      // })
      // .unwind('suppliers')
      // .project({
      //   _id: '$suppliers._id',
      //   name: '$suppliers.name',
      //   email: '$suppliers.email',
      //   phoneNumber: '$suppliers.phoneNumber',
      //   address: '$suppliers.address',
      // })
      // .group({
      //   _id: '$_id',
      //   name: { $first: '$name' },
      //   phoneNumber: { $first: '$phoneNumber' },
      //   email: { $first: '$email' },
      //   address: { $first: '$address' },
      // })

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

  question26b: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      fromDate = new Date(fromDate);

      const tmpToDate = new Date(toDate);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

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
        .lookup({
          from: 'orders',
          localField: 'products._id',
          foreignField: 'productList.productId',
          as: 'orders',
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        .project({
          name: 1,
          orders: 1,
          // products: 0,
        })
        .match({
          $or: [
            { orders: null },
            {
              $and: [
                { orders: { $ne: null } },
                {
                  $or: [
                    { 'orders.createdDate': { $lte: fromDate } },
                    { 'orders.createdDate': { $gte: toDate } },
                  ],
                },
              ],
            }
          ],
        })
        .group({
          _id: '$_id',
          name: { $first: '$name' },
        })

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

  // Không lọc theo ngày tháng
  question26c: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: 'orders',
          localField: '_id',
          foreignField: 'orderDetails.productId',
          as: 'orders',
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        // thêm bộ lọc ngày tháng ở đây nếu có
        .group({
          _id: '$supplierId',
          ordersArr: { "$push": "$orders" },
        })
        .match({
          ordersArr: { $size: 0 },
        })
        .lookup({
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier',
        })
        .unwind('supplier')
        .project({
          name: '$supplier.name',
          email: '$supplier.email',
          phoneNumber: '$supplier.phoneNumber',
          address: '$supplier.address',
        })

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

  question27: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind('productList')
        .addFields({
          'productList.originalPrice': {
            $divide: [
              {
                $multiply: [
                  '$productList.price',
                  { $subtract: [100, '$productList.discount'] },
                  // '$productList.quantity',
                ],
              },
              100,
            ],
          },
        })
        .lookup({
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employees',
        })
        .unwind('employees')
        .group({
          _id: '$employeeId',
          firstName: { $first: '$employees.firstName' },
          lastName: { $first: '$employees.lastName' },
          email: { $first: '$employees.email' },
          phoneNumber: { $first: '$employees.phoneNumber' },
          address: { $first: '$employees.address' },
          birthday: { $first: '$employees.birthday' },
          totalSales: {
            $sum: { $multiply: ['$productList.originalPrice', '$productList.quantity'] },
          },
        })
        .sort({ totalSales: -1 })
        .group({
          _id: '$totalSales',
          employees: { $push: '$$ROOT' },
        })
        .sort({ _id: -1 })
        .limit(3)
        .skip(0);

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

  question29: async (req, res, next) => {
    try {
      let results = await Product.distinct('discount')

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

  question30: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        })
        .project({
          description: 0,
          isDeleted: 0,
          createdAt: 0,
          updatedAt: 0,
          products: {
            categoryId: 0,
            supplierId: 0,
            description: 0,
            isDeleted: 0,
            stock: 0,
            price: 0,
            discount: 0,
          }
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: "orders",
          localField: "products._id",
          foreignField: "productList.productId",
          as: "orders",
        })
        .project({
          orders: {
            paymentType: 0,
            status: 0,
            createdDate: 0,
            createdAt: 0,
            updatedAt: 0,
            employeeId: 0,
            customerId: 0,
          }
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: "$orders.productList",
          preserveNullAndEmptyArrays: true,
        })
        .match({ // Lọc các sản phẩm trùng nhau
          $or: [
            {
              $expr: {
                $eq: ["$products._id", "$orders.productList.productId"],
              },
            },
            {
              orders: { $exists: false },
            },
          ],
        })
        .addFields({
          intoMoney: {
            $multiply: [
              "$orders.productList.price",
              "$orders.productList.quantity",
              {
                $divide: [
                  { $subtract: [100, "$orders.productList.discount"] },
                  100,
                ],
              },
            ],
          },
        })
        .project({
          orders: 0,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          totalAmount: { $sum: "$intoMoney" },
        })
        .sort({
          name: 1,
        })

      let total = await Category.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question30a: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: 'products',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'products'
        })
        .unwind({
          path: '$products',
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: 'orders',
          localField: 'products._id',
          foreignField: 'productList.productId',
          as: 'orders'
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: '$orders.productList',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          price: {
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
      // .group({
      //   _id: "$orders.productList._id",
      //   price: { $first: "$price" },
      // })
      // .group({
      //   _id: null,
      //   total: { $sum: "$price" }
      // })
      .project({
        products: 0,
        createdAt: 0,
        updatedAt: 0,
        isDeleted: 0,
        orders: {
          createdAt: 0,
          updatedAt: 0,
          createdDate: 0,
          shippedDate: 0,
          paymentType: 0,
          status: 0,
          customerId: 0,
          employeeId: 0,
        },
        orderId: "$orders._id",
      // productDetailId: "$orders.productList._id",
      // productId: "$orders.productList.productId",
      // quantity: "$orders.productList.quantity",
      // discount: "$orders.productList.discount",
      // price: "$orders.productList.price",
      })
      // .unwind({
      //   path: '$orders.productList',
      //   preserveNullAndEmptyArrays: true,
      // })
      // .project({
      //   name: 1,
      //   description: 1,
      //   orderId: "$orders._id",
      //   productDetailId: "$orders.productList._id",
      //   productId: "$orders.productList.productId",
      //   quantity: "$orders.productList.quantity",
      //   discount: "$orders.productList.discount",
      //   price: "$orders.productList.price",
      // })
      // .group({
      //   _id: "$_id",
      //   name: { $first: "$name"},
      //   description: { $first: "$description"},
      //   // orders: { $push: '$$ROOT' },
      //   orders: { $push: '$orders' },
      // })
      // .addFields({
      //   price: {
      //     $divide: [
      //       {
      //         $multiply: [
      //           '$price',
      //           { $subtract: [100, '$discount'] },
      //           '$quantity',
      //         ],
      //       },
      //       100,
      //     ],
      //   },
      // })
      // .group({
      //   _id: {
      //     _id: "$_id",
      //     productDetailId: "$productDetailId",
      //   },
      //   name: { $first: "$name"},
      //   description: { $first: "$description"},
      //   price: { $first: "$price"},
      // })
      // .group({
      //   _id: "$_id._id",
      //   name: { $first: "$name"},
      //   description: { $first: "$description"},
      //   price: { $sum: "$price"},
      // })
      // .group({
      //   _id: {
      //     _id: "$_id",
      //     productDetailId: "$productDetailId",
      //   },
      //   name: { $first: "$name"},
      //   description: { $first: "$description"},
      //   totalPrice: { $sum: "$price"},
      // })
      // .unwind({
      //   path: '$orders.productList',
      //   preserveNullAndEmptyArrays: true,
      // })
      // .addFields({
      //   originalPrice: {
      //     $divide: [
      //       {
      //         $multiply: [
      //           '$orders.productList.price',
      //           { $subtract: [100, '$orders.productList.discount'] },
      //         ],
      //       },
      //       100,
      //     ],
      //   },
      //   amount: '$orders.productList.quantity',
      // })
      // .group({
      //   // _id: '$_id',
      //   _id: {
      //     _id: "$_id",
      //     order: "$orders._id",
      //     // product: "$orders.productList._id",
      // },
      //   name: { $first: '$name' },
      //   description: { $first: '$description' },
      //   total: {
      //     $sum: { $multiply: ['$originalPrice', '$amount'] },
      //   },
      // })

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

  question33: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind('orderDetails')
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  '$orderDetails.price',
                  { $subtract: [100, '$orderDetails.discount'] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$orderDetails._id',
          createdDate: { $first: '$createdDate' },
          shippedDate: { $first: '$shippedDate' },
          status: { $first: '$status' },
          shippingAddress: { $first: '$shippingAddress' },
          description: { $first: '$description' },
          total: {
            $sum: { $multiply: ['$originalPrice', '$orderDetails.quantity'] },
          },
        })
        .group({
          _id: null,
          avg: { $avg: '$total' },
        })
        .project({
          _id: 0,
          avg: 1,
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

  question34: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind('orderDetails')
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  '$orderDetails.price',
                  { $subtract: [100, '$orderDetails.discount'] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$_id',
          createdDate: { $first: '$createdDate' },
          shippedDate: { $first: '$shippedDate' },
          status: { $first: '$status' },
          shippingAddress: { $first: '$shippingAddress' },
          description: { $first: '$description' },
          total: {
            $sum: { $multiply: ['$originalPrice', '$orderDetails.quantity'] },
          },
        })
        .group({
          _id: null,
          avg: { $avg: '$total' },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        })
        .project({
          _id: 0,
          avg: 1,
          total: 1,
          count: 1,
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
};
