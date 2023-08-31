const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

const Category = model('categories', categorySchema);
module.exports = Category;