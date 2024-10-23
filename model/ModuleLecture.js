const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Lecture = require('./Lecture'); 
const Module = require('./Module'); 

const ModuleLecture = sequelize.define('ModuleLecture', {
  lecture_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Lecture, 
      key: 'lecture_id', 
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

Module.hasMany(Lecture, { through: ModuleLecture, foreignKey: 'module_id', onDelete: 'CASCADE' });
Lecture.belongsToMany(Module, { through: ModuleLecture, foreignKey: 'lecture_id' });

module.exports = ModuleLecture;
