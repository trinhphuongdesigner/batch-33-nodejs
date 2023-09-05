const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, require: true, min: 0, default: 1 },
    discount: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    versionKey: false,
  },
);

// Virtual with Populate
productSchema.virtual('product', {
  // ref: 'Product',
  ref: 'products',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

// Virtuals in console.log()
productSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
productSchema.set('toJSON', { virtuals: true });

// -----------------------------------------------------------------------------------------------

const orderSchema = new Schema(
  {
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    shippedDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;

          if (value < this.createdDate) {
            return false;
          }

          return true;
        },
        message: `Shipped date: {VALUE} is invalid!`,
      },
    },

    paymentType: {
      type: String,
      required: true,
      default: 'CASH',
      enum: ['CASH', 'CREDIT_CARD'],
      // validate: {
      //   validator: (value) => {
      //     if (['CASH', 'CREDIT_CARD'].includes(value.toUpperCase())) {
      //       return true;
      //     }
      //     return false;
      //   },
      //   message: `Payment type: {VALUE} is invalid!`,
      // },
    },

    status: {
      type: String,
      required: true,
      enum: ['WAITING', 'COMPLETED', 'CANCELED', 'REJECTED', 'DELIVERING'],
      default: 'WAITING',
      // validate: {
      //   validator: (value) => {
      //     if (['WAITING', 'COMPLETED', 'CANCELED'].includes(value)) {
      //       return true;
      //     }
      //     return false;
      //   },
      //   message: `Status: {VALUE} is invalid!`,
      // },
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    // isDeleted: {
    //   type: Boolean,
    //   default: false,
    //   required: true,
    // },
    // Array
    productList: [productSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Virtual with Populate
orderSchema.virtual('customer', {
  ref: 'customers',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('employee', {
  ref: 'employees',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});

// Virtuals in console.log()
orderSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderSchema.set('toJSON', { virtuals: true });

const Order = model('orders', orderSchema);
module.exports = Order;
