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
  },
  is_main_category: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Category;
