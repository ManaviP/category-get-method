const Category = require('../model/category');
const Course = require('../model/Course');
const Skill = require('../model/Skill'); 
const User = require('../model/User');

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

const createCategory = async (req, res) => {
  const { category_name, parent_category_id } = req.body;
  
  try {
    if (parent_category_id) {
      const parentCategory = await Category.findByPk(parent_category_id);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Parent category does not exist' });
      }
    }
      const newCategory = await Category.create({
      category_name,
      parent_category_id: parent_category_id || null,
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { category_name, parent_category_id } = req.body;
  
  try {
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    if (parent_category_id) {
      const parentCategory = await Category.findByPk(parent_category_id);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Parent category does not exist' });
      }
    }
    
    category.category_name = category_name || category.category_name;
    category.parent_category_id = parent_category_id || category.parent_category_id;
    
    await category.save();
    
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
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
        {
          model: User, 
          through: { attributes: [] },
          attributes: ['user_id', 'name'],
        },
      ],
      attributes: [
        'course_id',
        'course_name',
        'course_description',
        'course_price',
        'course_mrp', 
        'course_level',
        'review',
        'duration',
      ],
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
  createCategory,   
  updateCategory,  
};
