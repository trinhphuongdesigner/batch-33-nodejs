var express = require('express');
var router = express.Router();

let { validateSchema, checkIdSchema } = require('../../utils');
const { getAllProduct, getDetailProduct, createProduct, putProduct, patchProduct, deleteProduct } = require('./controller');
const { checkCreateProductSchema } = require('./validation');

// router.get('/', getAllProduct);
// router.post('/', validateSchema(checkCreateSchema), createProduct);
// router.get('/:id', validateSchema(checkIdSchema), getDetailProduct);
// router.put('/:id', putProduct);
// router.patch('/:id', patchProduct)
// router.delete('/:id', deleteProduct);

router.route('/')
  .get(getAllProduct)
  .post(validateSchema(checkCreateProductSchema), createProduct)

router.route("/:id")
  .get(validateSchema(checkIdSchema), getDetailProduct)
  .put(validateSchema(checkIdSchema), putProduct)
  .patch(validateSchema(checkIdSchema), patchProduct)
  .delete(validateSchema(checkIdSchema), deleteProduct)

module.exports = router;
