const express = require('express');
const router = express.Router();
const TeachersController = require('../controllers/TeachersController.js');
const Authorization = require("../middlewares/authorization.js");

/* POST home page. */
router.post('/create', Authorization, TeachersController.createTeacher);
router.post('/update', Authorization, TeachersController.updateTeacher);
router.post('/delete', Authorization, TeachersController.deleteTeacher);

module.exports = router;
