const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Skill = sequelize.define('Skill', {
  skill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  skill_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skill_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = Skill;
