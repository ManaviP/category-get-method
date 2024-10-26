const express = require('express');
const router = express.Router();
const moduleController = require('../controller/moduleController');

router.get('/:id', moduleController.getModuleById);

module.exports = router;
