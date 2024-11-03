const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Course = require('./Course'); 

const WhatYouLearn = sequelize.define('WhatYouLearn', {
  WhatYouLearn_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { tableName: 'WhatYouLearns' });

const WhatReq = sequelize.define('WhatReq', {
  WhatReq_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { tableName: 'WhatReqs' });

const WhoCanJoin = sequelize.define('WhoCanJoin', {
  WhoCanJoin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { tableName: 'WhoCanJoins' });

const WhatYouLearnCourse = sequelize.define('WhatYouLearnCourse', {
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    allowNull: true,
  },
  WhatYouLearn_id: {
    type: DataTypes.INTEGER,
    references: {
      model: WhatYouLearn,
      key: 'WhatYouLearn_id',
    },
    allowNull: true,
  },
}, { tableName: 'WhatYouLearnCourses' });

const WhatReqCourse = sequelize.define('WhatReqCourse', {
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    allowNull: true,
  },
  WhatReq_id: {
    type: DataTypes.INTEGER,
    references: {
      model: WhatReq,
      key: 'WhatReq_id',
    },
    allowNull: true,
  },
}, { tableName: 'WhatReqCourses' });

const WhoCanJoinCourse = sequelize.define('WhoCanJoinCourse', {
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    allowNull: false,
  },
  WhoCanJoin_id: {
    type: DataTypes.INTEGER,
    references: {
      model: WhoCanJoin,
      key: 'WhoCanJoin_id',
    },
    allowNull: true,
  },
}, { tableName: 'WhoCanJoinCourses' });

Course.belongsToMany(WhatYouLearn, { through: WhatYouLearnCourse, foreignKey: 'course_id' });
WhatYouLearn.belongsToMany(Course, { through: WhatYouLearnCourse, foreignKey: 'WhatYouLearn_id' });

Course.belongsToMany(WhatReq, { through: WhatReqCourse, foreignKey: 'course_id' });
WhatReq.belongsToMany(Course, { through: WhatReqCourse, foreignKey: 'WhatReq_id' });

Course.belongsToMany(WhoCanJoin, { through: WhoCanJoinCourse, foreignKey: 'course_id' });
WhoCanJoin.belongsToMany(Course, { through: WhoCanJoinCourse, foreignKey: 'WhoCanJoin_id' });

module.exports = { WhatYouLearn, WhatReq, WhoCanJoin, WhatYouLearnCourse, WhatReqCourse, WhoCanJoinCourse };
