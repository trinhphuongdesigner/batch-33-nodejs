
const { getQueryDateTime, fuzzySearch } = require('../../utils');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
} = require('../../models');

module.exports = {
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
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        .match({
          $or: [
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
            },
            {
              orders: null,
            },
          ],
        })
        .lookup({
          from: 'suppliers',
          localField: 'supplierId',
          foreignField: '_id',
          as: 'suppliers',
        })
        .project({
          _id: 0,
          suppliers: 1,
        })
        .unwind('suppliers')
        .project({
          _id: '$suppliers._id',
          name: '$suppliers.name',
          email: '$suppliers.email',
          phoneNumber: '$suppliers.phoneNumber',
          address: '$suppliers.address',
        })
        .group({
          _id: '$_id',
          name: { $first: '$name' },
          phoneNumber: { $first: '$phoneNumber' },
          email: { $first: '$email' },
          address: { $first: '$address' },
        })

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
          foreignField: 'orderDetails.productId',
          as: 'orders',
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
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
        .unwind('orderDetails')
        .addFields({
          'orderDetails.originalPrice': {
            $divide: [
              {
                $multiply: [
                  '$orderDetails.price',
                  { $subtract: [100, '$orderDetails.discount'] },
                  // '$orderDetails.quantity',
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: '$employeeId',
          // firstName: { $first: '$employees.firstName' },
          // lastName: { $first: '$employees.lastName' },
          // email: { $first: '$employees.email' },
          // phoneNumber: { $first: '$employees.phoneNumber' },
          // address: { $first: '$employees.address' },
          // birthday: { $first: '$employees.birthday' },
          totalSales: {
            // $sum: '$orderDetails.originalPrice',
            $sum: { $multiply: ['$orderDetails.originalPrice', '$orderDetails.quantity'] },
          },
        })
        .lookup({
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employees',
        })
        .unwind('employees')
        .project({
          employeeId: '$_id',
          firstName: '$employees.firstName',
          lastName: '$employees.lastName',
          phoneNumber: '$employees.phoneNumber',
          address: '$employees.address',
          email: '$employees.email',
          totalSales: 1,
        })
        .sort({ totalSales: -1 })
        .limit(3)
        .skip(0);

      // .group({
      //   _id: '$totalSales',
      //   employees: { $push: '$$ROOT' },
      // })
      // // .sort({ _id: -1 })


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
      let results = await Order.distinct('orderDetails.discount')

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

  question30: async (req, res, next) => {
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
          foreignField: 'orderDetails.productId',
          as: 'orders'
        })
        .unwind({
          path: '$orders',
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: '$orders.orderDetails',
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  '$orders.orderDetails.price',
                  { $subtract: [100, '$orders.orderDetails.discount'] },
                ],
              },
              100,
            ],
          },
          amount: '$orders.orderDetails.quantity',
        })
        .group({
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          total: {
            $sum: { $multiply: ['$originalPrice', '$amount'] },
          },
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
