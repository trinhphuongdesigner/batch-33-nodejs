
const { getQueryDateTime, fuzzySearch } = require('../../utils');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
} = require('../../models');

module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $gt: 10 },
      };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1a: async (req, res, next) => {
    try {
      const { discount } = req.query;
      const conditionFind = {};

      if (discount) conditionFind.discount = { $lte: discount };

      let results = await Product.find(conditionFind).populate("category").populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1b: async (req, res, next) => {
    try {
      const { discount, type } = req.query;
      const conditionFind = {};

      if (discount) {
        switch (+type) {
        // switch (Number(type)) {
          // case 0:
          //   conditionFind.discount = { $eq: discount };
          //   break;

          case 1:
            conditionFind.discount = { $lt: discount };
            break;

          case 2:
            conditionFind.discount = { $lte: discount };
            break;

          case 3:
            conditionFind.discount = { $gt: discount };
            break;

          case 4:
            conditionFind.discount = { $gte: discount };
            break;

          default:
            conditionFind.discount = { $eq: discount };
            break;
        }
      }

      let results = await Product.find(conditionFind).populate("category").populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 100 },
      };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2a: async (req, res, next) => {
    try {
      const { stock } = req.query;
      const conditionFind = {};

      if (stock) conditionFind.stock = { $lte: stock };

      let results = await Product.find(conditionFind).populate("category").populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2b: async (req, res, next) => {
    try {
      const { stock, type } = req.query;
      const conditionFind = {};

      if (stock) {
        switch (Number(type)) {
          case 0:
            conditionFind.stock = { $eq: stock };
            break;

          case 1:
            conditionFind.stock = { $lt: stock };
            break;

          case 2:
            conditionFind.stock = { $lte: stock };
            break;

          case 3:
            conditionFind.stock = { $gt: stock };
            break;

          case 4:
            conditionFind.stock = { $gte: stock };
            break;

          default:
            conditionFind.stock = { $eq: stock };
            break;
        }
      }

      let results = await Product.find(conditionFind).populate("category").populate("supplier");
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3: async (req, res, next) => {
    try {
      // let discountedPrice = price * (100 - discount) / 100;
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90

      const m = { $multiply: ['$price', s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100
      // d = discountedPrice;

      // const conditionFind = { d: { $lte: d } }; // SAI

      const conditionFind = { $expr: { $lte: [d, 100] } };

      // const conditionFind = { $expr: { $lte: [{ $divide: [{ $multiply: ['$price', { $subtract: [100, '$discount'] }] }, 100] }, 1000] } };
      // const conditionFind = { discount : { $lte: 1000 }}; SAI

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        // .select('-categoryId -supplierId -description')
        // .lean(); // convert data to object

      // const newResults = results.map((item) => {
      //   const dis = item.price * (100 - item.discount) / 100;
      //   return {
      //     ...item,
      //     dis,
      //   }
      // }).filter((item) => item.dis <= 1000);

      // console.log('««««« newResults »»»»»', newResults);

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3a: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90

      const m = { $multiply: ['$price', s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const { discountedPrice } = req.query;

      let conditionFind = {};

      if (discountedPrice) {
        conditionFind = { $expr: { $lte: [d, parseFloat(discountedPrice)] } };
      }

      let results = await Product.find(conditionFind).lean(); // convert data to object

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3c: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   {
      //     $match: { $expr: { $lte: [d, 20000] } },
      //   },
      // ]);

      let results = await Product.aggregate()
        .match({ $expr: { $lte: [d, 100] } });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3d: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', 1000] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ['$disPrice', 100] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
          price: 0,
          discount: 0,
        });

      // let results = await Product.aggregate()
      // .match({ $expr: { $lte: [d, 100] } })
      // // .addFields({ disPrice: d })
      //   .project({
      //     categoryId: 0,
      //     supplierId: 0,
      //     description: 0,
      //     isDeleted: 0,
      //     price: 0,
      //     discount: 0,
      //   });

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

  question3e: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', 1000] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ['$disPrice', 100] } })
        .lookup({
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories',
        })
        .unwind('categories')
        .lookup({
          from: 'suppliers',
          localField: 'supplierId',
          foreignField: '_id',
          as: 'suppliers',
        })
        .unwind('suppliers')
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
          suppliers: {
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
          },
          categories: {
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
          },
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

  question3f: async (req, res, next) => {
    try {
      const s = { $subtract: [100, '$discount'] }; // (100 - 10) s => 90
      const m = { $multiply: ['$price', s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', 1000] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ['$disPrice', 100] } })
        .lookup({
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'a.b.c.categories',
        })
        .unwind('a.b.c.categories')
        // .addFields({ categories: '$a.b.c.categories' })
        .project({
          categories : '$a.b.c.categories',
        })
        // .lookup({
        //   from: 'suppliers',
        //   localField: 'supplierId',
        //   foreignField: '_id',
        //   as: 'suppliers',
        // })
        // .unwind('suppliers')
        // .project({
        //   categoryId: 0,
        //   supplierId: 0,
        //   description: 0,
        //   isDeleted: 0,
        //   suppliers: {
        //     isDeleted: 0,
        //     createdAt: 0,
        //     updatedAt: 0,
        //   },
        //   categories: {
        //     isDeleted: 0,
        //     createdAt: 0,
        //     updatedAt: 0,
        //   },
        // });

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

  question4: async (req, res, next) => {
    try {
      const { address } = req.query;

      const conditionFind = {
        address: new RegExp(address.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi'),
        address: fuzzySearch(address),
      };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

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

  question4a: async (req, res, next) => {
    try {
      const { address } = req.query;

      // const conditionFind = { address: { $regex: new RegExp(`${address}`), $options: 'i' } };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      let results = await Customer.aggregate().match({
        address: { $regex: new RegExp(`${address}`), $options: 'i' },
      });

      let total = await Customer.countDocuments();

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

  question5: async (req, res, next) => {
    try {
      const { year } = req.query;

      const conditionFind = {
        $expr: {
          $eq: [{ $year: '$birthday' }, year],
        },
      };

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

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

  question5a: async (req, res, next) => {
    try {
      const year = Number(req.query.year);

      const conditionFind = {
        $expr: {
          $eq: [{ $year: '$birthday' }, year],
        },
      };

      let results = await Customer.aggregate()
        .match(conditionFind)
        .addFields({
          birthYear: { $year: '$birthday' }
        });

      let total = await Customer.countDocuments();

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

  question6: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today;

      if (!date) {
        today = new Date();
      } else {
        today = new Date(date);
      }

      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }],
            },
            { $eq: [{ $month: '$birthday' }, { $month: today }] },
          ],
        },
      };

      // const eqDay = {
      //   $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }],
      // };
      // const eqMonth = { $eq: [{ $month: '$birthday' }, { $month: today }] };

      // const conditionFind = {
      //   $expr: {
      //     $and: [eqDay, eqMonth],
      //   },
      // };

      console.log('««««« conditionFind »»»»»', conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

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

  question7: async (req, res, next) => {
    try {
      const { status } = req.query;
      // const conditionFind = {
      //   $expr: {
      //     $eq: ['$status', status],
      //   },
      // }

      // let results = await Order.find(conditionFind) // ~ match
      let results = await Order.find({ status }) // ~ match
        .populate({ path: 'customer', select: 'firstName lastName' }) // select để chọn lọc dữ liệu trả về
        // .populate('customer')
        .populate('employee')
        .populate({
          path: 'productList.product',
          select: { name: 1, stock: 1 },
        })
        .lean();

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

  question7a: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.aggregate()
        .match({ status }) // ~ find
        .lookup({
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'Customer',
        })
        .unwind('Customer')
        .lookup({
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        })
        .unwind('employee')
        .project({
          customerId: 0,
          employeeId: 0,
          // shippedDate: 0,
          // paymentType: 0,
          // status: 0,
          // orderDetails: 0,
          // createdDate: 0,
        });
      // .lookup({
      //   from: 'products',
      //   localField: 'orderDetails.productId',
      //   foreignField: '_id',
      //   as: 'productList.product',
      // })
      // .unwind('product')
      // .populate({ path: 'customer', select: 'firstName lastName' })
      // .populate('employee')
      // .populate({
      //   path: 'productList.product',
      //   select: { name: 1 , stock: 1},
      // })
      // .select('-customerId -employeeId -orderDetails.productId')
      // .lean();

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

  question8a: async (req, res, next) => {
    try {
      let { status, date } = req.query;
      const findDate = date ? new Date(date) : new Date();

      const conditionFind = {
        $expr: {
          $and: [
            { status }, // { $eq: ['$status', status] },
            {$eq: [{ $dayOfMonth: '$shippedDate' }, { $dayOfMonth: findDate }] },
            { $eq: [{ $month: '$shippedDate' }, { $month: findDate }] },
            { $eq: [{ $year: '$shippedDate' }, { $year: findDate }] },
          ],
        },
      };

      let results = await Order.find(conditionFind).lean();

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

  question8c: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ['$status', status] };
      const compareFromDate = { $lt: ['$shippedDate', fromDate] };
      const compareToDate = { $gt: ['$shippedDate', toDate] };

      const conditionFind = {
        $expr: {
          $or: [
            {
              $and: [compareStatus, compareFromDate],
            },
            {
              $and: [compareStatus, compareToDate]
            },
          ]
        },
      };

      let results = await Order.find(conditionFind)
        .populate('productList.product')
        .populate('customer')
        .populate('employee')
        .lean();

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

  question8b: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ['$status', status] };
      const compareFromDate = { $gte: ['$shippedDate', fromDate] };
      const compareToDate = { $lt: ['$shippedDate', toDate] };

      const conditionFind = {
        $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
      };

      let results = await Order.find(conditionFind)
        .populate('productList.product')
        .populate('customer')
        .populate('employee')
        .lean();

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

  question18: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: 'products',
          localField: '_id', // TRUY VẤN NGƯỢC!!!
          foreignField: 'categoryId',
          as: 'products',
        })
        // .unwind('products') //   sẽ dẫn dến thiếu dự liệu
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
          totalProduct: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $gt: ['$products.stock', 0] },
                  ]
                }, then: 1, else: 0
              }
            },
          },
        })
        .sort({
          totalProduct: -1,
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
        .lookup({
          from: 'products',
          localField: 'productList.productId',
          foreignField: '_id',
          as: 'productList.product',
        })
        .unwind('productList.product')
        .group({
          _id: '$productList.productId',
          // _id: '$productList.product._id',
          name: { $first: '$productList.product.name' },
          price: { $first: '$productList.product.price' },
          discount: { $first: '$productList.product.discount' },
          stock: { $first: '$productList.product.stock' },
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
        //   path: '$orderDetails',
        //   preserveNullAndEmptyArrays: true,
        // })
        .unwind('orderDetails')
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
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
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
          _id: null,
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
          foreignField: 'orderDetails.productId',
          as: 'orders',
        })
        .match({
          orders: { $size: 0 },
        })
        .project({
          name: 1,
          price: 1,
          stock: 1,
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
