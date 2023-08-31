const { default: mongoose } = require('mongoose');

let data = require('../../data/categories.json');
const { sendErr, generationID, writeFileSync } = require('../../utils');
const Category = require('../../models/category');

mongoose.connect('mongodb://127.0.0.1:27017/node-33-database');

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

      // if (result.isDeleted) {
      //   return res.send(
      //     400,
      //     {
      //       message: "Danh mục đã bị xóa",
      //     },
      //   );
      // }
  
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

  putCategory: (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
  
      const updateData = {
        id: +id,
        name,
        description,
      };
  
      data = data.map((item) => {
        if (item.id === +id) {
          return updateData;
        }
  
        return item;
      })
  
      writeFileSync("data/categories.json", data);
  
      return res.send(
        202,
        {
          message: "Cập nhật sản phẩm thành công",
          payload: updateData,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  patchCategory: (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      let updateData = {};
  
      data = data.map((item) => {
        if (item.id === +id) {
          updateData = {
            ...item,
            name: name || item.name,
            description: description || item.description,
          };
  
          console.log('««««« updateData »»»»»', updateData);
  
          return updateData;
        }
  
        return item;
      });
  
      writeFileSync("data/categories.json", data);
  
      if (updateData) {
        return res.send(
          202,
          {
            message: "Cập nhật sản phẩm thành công",
            payload: updateData,
          },
        );
      }
  
      return sendErr(res);
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  deleteCategory: (req, res, next) => {
    try {
      const { id } = req.params;

      data = data.map((item) => {
        if (item.id === +id) {
          return {
            ...item,
            isDeleted: true,
          };
        };
  
        return item;
      });
  
      writeFileSync("data/categories.json", data);
  
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