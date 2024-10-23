const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Module = require('./Module');

const Lecture = sequelize.define('Lecture', {
  lecture_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  module_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Module,
      key: 'module_id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  is_preview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

Lecture.belongsTo(Module, { foreignKey: 'module_id', onDelete: 'CASCADE' });
Module.hasMany(Lecture, { foreignKey: 'module_id', onDelete: 'CASCADE' });

module.exports = Lecture;
