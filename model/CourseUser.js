const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');
const Course = require('./Course');

const CourseUser = sequelize.define('CourseUser', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    allowNull: false,
  },
});

Course.belongsToMany(User, { through: CourseUser, foreignKey: 'course_id' });
User.belongsToMany(Course, { through: CourseUser, foreignKey: 'user_id' });

module.exports = CourseUser;
