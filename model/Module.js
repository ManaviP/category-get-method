const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Course = require('./Course');
const Lecture = require('./Lecture');

const Module = sequelize.define('Module', {
  module_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  module_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  lecture_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Lecture,
      key: 'lecture_id',
    },
    onDelete: 'SET NULL',
    allowNull: true,
  }
});

Module.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Course.hasMany(Module, { foreignKey: 'course_id', onDelete: 'CASCADE' });

module.exports = Module;
