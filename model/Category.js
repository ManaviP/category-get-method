const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parent_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'category_id',
    },
  },
  is_main_category: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Category.hasMany(Category, { foreignKey: 'parent_category_id', as: 'subcategories',onDelete: 'CASCADE',});

Category.belongsTo(Category, { foreignKey: 'parent_category_id', as: 'parentCategory' });

sequelize.sync()
  .then(() => console.log('Category model synced with database'))
  .catch(err => console.error('Error syncing Category model:', err));

module.exports = Category;
