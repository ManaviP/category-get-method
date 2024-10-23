const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Course = require('./Course'); 
const Module = require('./Module'); 

const CourseModule = sequelize.define('CourseModule', {
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course, 
      key: 'course_id', 
    },
    allowNull: false,
  },
  module_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Module, 
      key: 'module_id', 
    },
    allowNull: false,
  },
});

Course.hasMany(Module, { through: CourseModule, foreignKey: 'course_id', onDelete: 'CASCADE' });
Module.belongsToMany(Course, { through: CourseModule, foreignKey: 'module_id' });

module.exports = CourseModule;
