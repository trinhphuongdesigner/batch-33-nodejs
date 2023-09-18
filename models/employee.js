const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const bcrypt = require('bcryptjs');

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Tên không được bỏ trống'],
      maxLength: [50, 'Tên không được vượt quá 50 ký tự'],
    },
    lastName: {
      type: String,
      required: [true, 'Họ không được bỏ trống'],
      maxLength: [50, 'Họ không được vượt quá 50 ký tự'],
    },
    phoneNumber: {
      type: String,
      maxLength: [50, 'Số điện thoại không được vượt quá 50 ký tự'],
      validate: {
        validator: function (value) {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} is not a valid phone!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ không được bỏ trống'],
      maxLength: [500, 'Địa chỉ không được vượt quá 500 ký tự'],
      unique: [true, 'Địa chỉ không được trùng'],
    },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} is not a valid email!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
      required: [true, 'Email không được bỏ trống'],
      maxLength: [50, 'Email không được vượt quá 50 ký tự'],
      unique: [true, 'Email không được trùng'],
    },
    birthday: { type: Date },
    password: {
      type: String,
      required: true,
      minLength: [3, 'Không được ít hơn 3 ký tự'],
      maxLength: [12, 'Không được vượt quá 12 ký tự'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.pre('save', async function (next) {
  try {
    // generate salt key
    const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
    // generate password = salt key + hash key
    const hashPass = await bcrypt.hash(this.password, salt);
    // override password
    this.password = hashPass;

    next();
  } catch (err) {
    next(err);
  }
});

employeeSchema.methods.isValidPass = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Config
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });
//
employeeSchema.plugin(mongooseLeanVirtuals);

const Employee = model('employees', employeeSchema);
module.exports = Employee;
