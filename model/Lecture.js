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
    allowNull: false,
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_preview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Lecture;
