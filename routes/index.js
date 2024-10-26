const express = require('express');
const router = express.Router();

const CategoryRoutes = require('./CategoryRoutes');
const CourseRoutes = require('./CourseRoutes');
const UserRoutes = require('./UserRoutes');
const ModuleRoutes = require('./ModuleRoutes');

router.use('/categories', CategoryRoutes);
router.use('/courses', CourseRoutes);
router.use('/users', UserRoutes);
router.use('/modules', ModuleRoutes);

module.exports = router;
