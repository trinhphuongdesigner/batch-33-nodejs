let data = require('../../data/categories.json');
const { sendErr, generationID, writeFileSync } = require('../../utils');
const { Category } = require('../../models');

module.exports = {
  getAllCategory: async (req, res, next) => {
    try {
      const result = await Category.find({ isDeleted: false });

      return res.send(
        200,
        {
          message: "Lấy thông tin thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getDetailCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const result = await Category.findById(id);
      // const result = await Category.findOne({
      //   _id : id,
      //   isDeleted: false,
      // });
  
      if (!result) {
        return res.send(
          404,
          {
            message: "Không tìm thấy",
          },
        );
      }

      if (result.isDeleted) {
        return res.send(
          400,
          {
            message: "Danh mục đã bị xóa",
          },
        );
      }
  
      return res.send(
        202,
        {
          message: "Lấy thông tin thành công",
          payload: result,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  createCategory: async (req, res, next) => {
    try {
      const { name, description } = req.body;
  
      const newCategory = new Category({
        name,
        description,
      });

      const result = await newCategory.save();
  
      return res.send(
        202,
        {
          message: "Tạo sản phẩm thành công",
          payload: result,
        },
      );
    } catch (error) {
      sendErr(res, error.errors);
    }
  },

  patchCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // const result = await Category.findByIdAndUpdate(id, {name, description}, { new: true })
      // const result = await Category.findOneAndUpdate(
      //   {
      //     // _id : mongoose.Types.ObjectId(id)
      //     _id : id,
      //     isDeleted: false,
      //   },
      //   {name, description},
      //   { new: true },
      // );
      const result1 = await Category.findById(id);

      if (!result1) {
        return res.send(
          404,
          {
            message: "Không tìm thấy",
          },
        );
      }

      if (result1.isDeleted) {
        return res.send(
          404,
          {
            message: "Đã bị xóa",
          },
        );
      }

      const result2 = await Category.findByIdAndUpdate(id, { name, description }, { new: true })

      return res.send(
        202,
        {
          message: "Cập nhật danh mục thành công",
          payload: result2,
        },
      );

    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  putCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // const result = await Category.findByIdAndUpdate(id, {name, description}, { new: true })
      // const result = await Category.findOneAndUpdate(
      //   {
      //     // _id : mongoose.Types.ObjectId(id)
      //     _id : id,
      //     isDeleted: false,
      //   },
      //   {name, description},
      //   { new: true },
      // );
      const result1 = await Category.findById(id);

      if (!result1) {
        return res.send(
          404,
          {
            message: "Không tìm thấy",
          },
        );
      }

      if (result1.isDeleted) {
        return res.send(
          404,
          {
            message: "Đã bị xóa",
          },
        );
      }

      // const result2 = await Category.findByIdAndUpdate(id, { name, description: undefined }, { new: true })
      const result2 = await Category.findByIdAndUpdate(id, { $set: { name, description: null } }, { new: true })

      return res.send(
        202,
        {
          message: "Cập nhật danh mục thành công",
          payload: result2,
        },
      );

    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result1 = await Category.findById(id);

      if (!result1) {
        return res.send(
          404,
          {
            message: "Không tìm thấy",
          },
        );
      }

      if (result1.isDeleted) {
        return res.send(
          404,
          {
            message: "Danh mục đã bị xóa từ trước",
          },
        );
      }

      await Category.updateOne({ _id: id }, { isDeleted: true })

      return res.send(
        202,
        {
          message: "Xóa sản phẩm thành công",
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    };
  },
}