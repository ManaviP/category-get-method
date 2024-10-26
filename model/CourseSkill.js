const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Course = require('./Course');
const Skill = require('./Skill');

const CourseSkill = sequelize.define('CourseSkill', {
  course_skill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
  },
  skill_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Skill,
      key: 'skill_id',
    },
  },
});

Course.belongsToMany(Skill, { through: CourseSkill, foreignKey: 'course_id' });
Skill.belongsToMany(Course, { through: CourseSkill, foreignKey: 'skill_id' });

module.exports = CourseSkill;