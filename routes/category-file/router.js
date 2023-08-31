var express = require('express');
var router = express.Router();

let { validateSchema, checkIdSchema } = require('../../utils');
const { getAllCategory, getDetailCategory, createCategory, putCategory, patchCategory, deleteCategory } = require('./controller');
const { checkCreateCategorySchema, checkPutCategorySchema, checkPatchCategorySchema } = require('./validation');

// router.get('/', getAllCategory);
// router.post('/', validateSchema(checkCreateSchema), createCategory);
// router.get('/:id', validateSchema(checkIdSchema), getDetailCategory);
// router.put('/:id', putCategory);
// router.patch('/:id', patchCategory)
// router.delete('/:id', deleteCategory);

router.route('/')
  .get(getAllCategory)
  .post(validateSchema(checkCreateCategorySchema), createCategory)

router.route("/:id")
  .get(validateSchema(checkIdSchema), getDetailCategory)
  .put(validateSchema(checkIdSchema), validateSchema(checkPutCategorySchema), putCategory)
  .patch(validateSchema(checkIdSchema), validateSchema(checkPatchCategorySchema), patchCategory)
  .delete(validateSchema(checkIdSchema), deleteCategory)

module.exports = router;
