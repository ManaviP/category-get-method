const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.get('/', categoryController.getParentCategories);
router.get('/:id/subcategories', categoryController.getSubCategories);
router.get('/:id/courses', categoryController.getCoursesBySubCategory);
router.delete('/:id', categoryController.deleteCategory); 

module.exports = router;