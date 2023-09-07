const express = require('express');
const router = express.Router();
const ClassesController = require("../controllers/ClassesController.js");
const Authorization = require("../middlewares/authorization.js");

/* POST home page. */
router.post('/create', Authorization, ClassesController.createClass);
router.post('/update', Authorization, ClassesController.updateClass);
router.post('/delete', Authorization, ClassesController.deleteClass);

module.exports = router;