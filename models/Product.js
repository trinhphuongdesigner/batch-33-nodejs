const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const productSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [50, 'Tên sản phẩm không được vượt quá 50 ký tự'],
    },
    price: { type: Number, required: [true, 'Giá không được để trống'], min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    // Reference to Category
    categoryId: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    // Reference to Supplier
    supplierId: { type: Schema.Types.ObjectId, ref: 'suppliers', required: true },
    description: {
      type: String,
      maxLength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timeStamp: true,
  },
);

productSchema.virtual('discountedPrice').get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

// Virtual with Populate
productSchema.virtual('category', {
  ref: 'categories',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('supplier', {
  ref: 'suppliers',
  localField: 'supplierId',
  foreignField: '_id',
  justOne: true,
});

// Config
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });
//
productSchema.plugin(mongooseLeanVirtuals);

const Product = model('products', productSchema);
module.exports = Product;