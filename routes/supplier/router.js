var express = require('express');
var router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils');
const {
  getAll,
  create,
  search,
  getDetail,
  update,
  deleteFunc,
} = require('./controller');
const { supplierSchema, supplierPatchSchema } = require('./validation');

router.route('/')
  .get(getAll)
  .post(validateSchema(supplierSchema), create);

router.get('/search', search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(supplierSchema), update)
  .patch(validateSchema(checkIdSchema), validateSchema(supplierPatchSchema), update)
  .delete(validateSchema(checkIdSchema), deleteFunc);

module.exports = router;
