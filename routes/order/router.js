const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../utils');
const {
  getDetailSchema,
  createSchema,
  updateEmployeeSchema,
  updateShippingDateSchema,
  updateStatusSchema,
} = require('./validations');
const {
  getAll,
  getDetail,
  create,
  updateStatus,
  updateShippingDate,
  updateEmployee,
} = require('./controller');

router.route('/')
  .get(getAll)
  .post(validateSchema(createSchema), create)

router.route('/:id')
  .get(validateSchema(getDetailSchema), getDetail)

router.route('/status/:id')
  .patch(validateSchema(updateStatusSchema), updateStatus)

router.route('/shipping/:id')
  .patch(validateSchema(updateShippingDateSchema), updateShippingDate)

router.route('/employee/:id')
  .patch(validateSchema(updateEmployeeSchema), updateEmployee)

module.exports = router;
