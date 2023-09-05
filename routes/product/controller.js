const { Product, Category, Supplier } = require('../../models');
const { fuzzySearch, toObjectId } = require('../../utils');

module.exports = {
  getAll: async (req, res, next) => { // NOTE
    try {
      let results = await Product.find({
        isDeleted: false,
      })
        .populate('category')
        .populate('supplier')
        .lean();

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.send(404, {
        message: "Không tìm thấy",
        err,
      });
    }
  },

  getList: async (req, res, next) => { // NOTE
    try {
      const { page, pageSize } = req.query; // 10 - 1
      const limit = pageSize || 10; // 10
      const skip = limit * (page - 1) || 0;

      const conditionFind = { isDeleted: false };

      let results = await Product.find(conditionFind)
        .populate('category')
        .populate('supplier')
        .skip(skip)
        .limit(limit)
        .sort({ "name": 1, "price": 1 , "discount": -1})
        .lean();

      const total = await Product.countDocuments(conditionFind)

      return res.send({ code: 200, total, count: results.length, payload: results });
    } catch (err) {
      return res.send(404, {
        message: "Không tìm thấy",
        err,
      });
    }
  },

  search: async (req, res, next) => {
    try {
      const { keyword, categoryId, priceStart, priceEnd, supplierId, page, pageSize, stockStart, stockEnd, discountStart, discountEnd } = req.query;
      const limit = pageSize || 12; // 10
      const skip = limit * (page - 1) || 0;

      const conditionFind = { isDeleted: false };

      if (keyword) conditionFind.name = fuzzySearch(keyword);

      if (categoryId) {
        conditionFind.categoryId = categoryId;
        // conditionFind.$expr = { $eq: ['$categoryId', categoryId] };
      };

      if (supplierId) {
        conditionFind.supplierId = supplierId;
      };

      if (priceStart && priceEnd) { // 20 - 50
        const compareStart = { $lte: ['$price', priceEnd] }; // '$field'
        const compareEnd = { $gte: ['$price', priceStart] };
        conditionFind.$expr = { $and: [compareStart, compareEnd] };
      } else if (priceStart) {
        conditionFind.price = { $gte: parseFloat(priceStart) };
      } else if (priceEnd) {
        conditionFind.price = { $lte: parseFloat(priceEnd) };
      }

      const result = await Product.find(conditionFind)
        .populate('category')
        .populate('supplier')
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(conditionFind)

      res.send(200, {
        message: "Thành công",
        payload: result,
        total,
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
      })
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let result = await Product.findOne({
        _id: id,
        isDeleted: false,
      })
        .populate('category')
        .populate('supplier');

      if (result) {
        return res.send({ code: 200, payload: result });
      }

      return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
    } catch (err) {
      res.status(404).json({
        message: 'Get detail fail!!',
        payload: err,
      });
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, price, discount, stock, description, supplierId, categoryId } = req.body;

      // const existSupplier = await Supplier.find({ // 10s
      //   _id: supplierId,
      //   isDeleted: false,
      // });
      // const existCategory = await Category.find({ // 20s
      //   _id: categoryId,
      //   isDeleted: false,
      // });
      const getSupplier = Supplier.findOne({
        _id: supplierId,
        // isDeleted: false,
      });
      const getCategory =  Category.findOne({
        _id: categoryId,
        // isDeleted: false,
      });

      const [existSupplier, existCategory] = await Promise.all([getSupplier, getCategory]);

      const error = [];
      if (!existSupplier) error.push("Nhà cung cấp không khả dụng");
      if (existSupplier.isDeleted) error.push("Nhà cung cấp đã bị xóa");
      if (!existCategory) error.push("Danh mục không khả dụng");
      if (existCategory.isDeleted) error.push("Danh mục đã bị xóa");

      if (error.length > 0 ) {
        return res.send(400, {
          error,
          message: "Không khả dụng"
        });
      }

      const newRecord = new Product({
        name, price, discount, stock, description, supplierId, categoryId,
      });

      let result = await newRecord.save();

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(404, {
        message: "Có lỗi",
        error,
      });
    }
  },

  fake: async (req, res, next) => {
    try {
      const { products } = req.body;

      const getSupplier = Supplier.findOne({
        isDeleted: false,
      });
      const getCategory =  Category.findOne({
        isDeleted: false,
      });

      const [existSupplier, existCategory] = await Promise.all([getSupplier, getCategory]);

      const data = products.map((item) => ({
        ...item,
        supplierId: existSupplier._id,
        categoryId: existCategory._id,
      }))
      let result = await Product.insertMany(data);

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(404, {
        message: "Có lỗi",
        error,
      });
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price, discount, stock, description, supplierId, categoryId } = req.body;

      // Check if the product exists and is not deleted
      const product = await Product.findOne({ _id: id, isDeleted: false });

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      const error = [];

      // Check if the supplier exists and is not deleted
      if (product.supplierId.toString() !== supplierId.toString()) {
        const supplier = await Supplier.findOne({ _id: supplierId, isDeleted: false });

        if (!supplier) error.push("Nhà cung cấp không khả dụng");
      }

      // Check if the category exists and is not deleted
      if (product.categoryId.toString() !== categoryId) {
        const category = await Category.findOne({ _id: categoryId, isDeleted: false });

      if (!category)  error.push("Danh mục không khả dụng");
      };

      if (error.length > 0 ) {
        return res.send(400, {
          error,
          message: "Không khả dụng"
        });
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, discount, stock, description, supplierId, categoryId },
        { new: true }
      );

      if (updatedProduct) {
        return res.status(200).json({
          message: "Update successful",
          payload: updatedProduct,
        });
      }

      return res.status(400).json({ message: "Update failed" });
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(404, {
        message: "Có lỗi",
        error,
      });
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Product.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      if (result) {
        return res.send(200, {
          message: "Xóa thành công",
          payload: result,
        });
      }

      return res.send(400, {
        message: "Thất bại",
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
        error,
      });
    }
  },
};