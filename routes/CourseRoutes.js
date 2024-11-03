const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');

router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/:id', courseController.getCourseById);
router.get('/search', courseController.searchCoursesOrSkills);
router.get('/:id/evaluate', courseController.evaluateCourseData);
router.put('/:id/publish', courseController.publishCourse); 

module.exports = router;