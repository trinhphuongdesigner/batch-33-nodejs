var express = require('express');
var router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils')

const { getDetail, getList, getAll, search, create, update, updatePatch, hardDelete, softDelete } = require('./controller');
const { validationSchema, validationQuerySchema } = require('./validation');

router.route('/all')
  .get(getAll);

router.route('/')
  .get(getList)
  .post(validateSchema(validationSchema), create)

router.get('/search', validateSchema(validationQuerySchema), search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(validationSchema), update)

router.patch('/delete/:id', softDelete);

module.exports = router;
