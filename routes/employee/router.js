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
const { employeeSchema, employeePatchSchema } = require('./validation');

router.route('/')
  .get(getAll)
  .post(validateSchema(employeeSchema), create);

router.get('/search', search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(employeeSchema), update)
  .patch(validateSchema(checkIdSchema), validateSchema(employeePatchSchema), update)
  .delete(validateSchema(checkIdSchema), deleteFunc);

module.exports = router;
