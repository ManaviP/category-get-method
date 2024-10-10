const Category = require('../model/category');
const Course = require('../model/Course');

const getParentCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        parent_category_id: null,
      },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSubCategories = async (req, res) => {
  const parentId = req.params.id;
  try {
    const subCategories = await Category.findAll({
      where: {
        parent_category_id: parentId,
      },
    });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getCoursesBySubCategory = async (req, res) => {
  const subCategoryId = req.params.id;
  try {
    const courses = await Course.findAll({
      where: {
        category_id: subCategoryId,
      },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  getParentCategories,
  getSubCategories,
  getCoursesBySubCategory
};
