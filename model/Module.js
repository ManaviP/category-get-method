const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Module = sequelize.define('Module', {
  module_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  module_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Module;
