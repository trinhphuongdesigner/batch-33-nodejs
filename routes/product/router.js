var express = require('express');
var router = express.Router();
const passport = require('passport');

const { validateSchema, checkIdSchema } = require('../../utils')

const { getDetail, getList, getAll, search, create, update, updatePatch, hardDelete, softDelete, fake } = require('./controller');
const { validationSchema, validationQuerySchema } = require('./validation');

router.route('/all')
  .get(getAll);

router.route('/')
  .get(getList)
  .post(passport.authenticate('jwt', { session: false }), validateSchema(validationSchema), create)

router.route('/fake')
  .post(fake)

router.get('/search', validateSchema(validationQuerySchema), search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(passport.authenticate('jwt', { session: false }), validateSchema(checkIdSchema), validateSchema(validationSchema), update)

router.patch('/delete/:id', passport.authenticate('jwt', { session: false }), softDelete);

module.exports = router;
