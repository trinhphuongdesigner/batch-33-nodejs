const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
      // maxLength: 50,
      required: [true, 'Tên danh mục không được bỏ trống'],
      maxLength: [50, 'Tên danh mục không được vượt quá 50 ký tự'],
      unique: [true, 'Tên danh mục không được trùng'],
    },
    description: {
      type: String,
      maxLength: [500, 'Mô tả danh mục không được vượt quá 500 ký tự'],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Category = model('categories', categorySchema);
module.exports = Category;