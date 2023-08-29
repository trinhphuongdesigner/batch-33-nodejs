let data = require('../../data/categories.json');
const { sendErr, generationID, writeFileSync } = require('../../utils');

module.exports = {
  getAllCategory: (req, res, next) => {
    try {
      return res.send(
        200,
        {
          message: "Lấy thông tin thành công",
          payload: data.filter((item) => !item.isDeleted),
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.send(400, { message: "Không thành công" });
    }
  },

  getDetailCategory: (req, res, next) => {
    try {
      const { id } = req.params;
  
      const detail = data.find((item) => item.id.toString() === id);
  
      if (!detail) {
        return res.send(
          404,
          {
            message: "Không tìm thấy",
          },
        );
      }

      if (detail.isDeleted) {
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
          payload: detail,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      return sendErr(res);
    }
  },

  createCategory: (req, res, next) => {
    try {
      const { name, description } = req.body;
  
      const newP = { id: generationID(), name, description, isDeleted: false };
  
      data = [...data, newP];
  
      writeFileSync("data/categories.json", data);
  
      return res.send(
        202,
        {
          message: "Tạo sản phẩm thành công",
          payload: newP,
        },
      );
    } catch (error) {
      console.log('««««« error »»»»»', error);
      sendErr(res);
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