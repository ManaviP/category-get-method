const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Category = require('./category'); 

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  course_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  course_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  course_mrp: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  course_level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  review: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'category_id',
    },
    onDelete: 'CASCADE',
  },
});
Course.belongsTo(Category, {foreignKey: 'category_id',onDelete: 'CASCADE', });

module.exports = Course;