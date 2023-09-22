
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

};
