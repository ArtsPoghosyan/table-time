const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectsController.js');
const Authorization = require("../middlewares/authorization.js");

/* POST home page. */
router.post('/create', Authorization, SubjectController.createSubject);
router.post('/update', Authorization, SubjectController.updateSubject);
router.post('/delete', Authorization, SubjectController.deleteSubject);

module.exports = router;