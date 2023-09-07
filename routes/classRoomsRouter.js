const express = require('express');
const router = express.Router();
const ClassRoomsController = require('../controllers/ClassRoomsController.js');
const Authorization = require("../middlewares/authorization.js");

/* POST home page. */
router.post('/create', Authorization, ClassRoomsController.createClassRoom);
router.post('/update', Authorization, ClassRoomsController.updateClassRoom);
router.post('/delete', Authorization, ClassRoomsController.deleteClassRoom);

module.exports = router;
