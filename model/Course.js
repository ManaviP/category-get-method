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
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category, 
      key: 'category_id',
    },
  },
});

Category.hasMany(Course, { foreignKey: 'category_id' });
Course.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Course;
