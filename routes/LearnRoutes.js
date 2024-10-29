const express = require('express');
const router = express.Router();
const learnController = require('../controller/learnController');

router.post('/learn', learnController.createCourseInfo);
router.get('/learn/:courseId',learnController.getCourseInfo);
router.put('/learn/:courseId', learnController.updateCourseInfo);
router.delete('/learn/:courseId', learnController.deleteCourseInfo);

module.exports = router;
