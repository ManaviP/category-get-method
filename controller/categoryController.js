const Category = require('../model/category');
const Course = require('../model/Course');
const Skill = require('../model/Skill'); 

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
      include: [
        {
          model: Category,
          as: 'Category',
          attributes: ['category_id', 'category_name'],
        },
        {
          model: Skill,
          through: { attributes: [] },
          attributes: ['skill_id', 'skill_name'],
        },
      ],
      attributes: ['course_id', 'course_name', 'course_description', 'course_price'],
    });

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  getParentCategories,
  getSubCategories,
  getCoursesBySubCategory,
};
