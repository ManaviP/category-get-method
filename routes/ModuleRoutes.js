const express = require('express');
const router = express.Router();
const moduleController = require('../controller/moduleController');

router.get('/:courseId/modules/:id', moduleController.getModuleById);
router.put('/:courseId/modules/:id', moduleController.updateModuleName);
router.post('/:courseId/modules/:moduleId/lectures', moduleController.createLecture);
router.put('/:courseId/modules/:moduleId/lectures/:id', moduleController.updateLecture);
router.delete('/:courseId/modules/:moduleId/lectures/:id', moduleController.deleteLecture);

module.exports = router;
