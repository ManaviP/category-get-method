const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Lecture = sequelize.define('Lecture', {
  lecture_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_preview: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = Lecture;
