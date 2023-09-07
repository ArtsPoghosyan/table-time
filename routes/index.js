const express = require('express');
const router = express.Router();
const tableRouter = require("./tableRouter.js");
const tableSettingsRouter = require("./settingsRouter.js");
const tableSubjectsRouter = require("./subjectsRouter.js");
const tableTeachersRouter = require("./teachersRouter.js");
const tableClassesRouter = require("./classesRouter.js");
const tableClassRoomsRouter = require("./classRoomsRouter.js");
const tableLessonsRouter = require("./lessonsRouter.js");
const TableController = require("../controllers/TableController.js");
const Authorization = require("../middlewares/authorization.js");

router.use('/table', tableRouter)
router.use('/settings', tableSettingsRouter);
router.use('/subjects', tableSubjectsRouter);
router.use('/teachers', tableTeachersRouter);
router.use('/classes', tableClassesRouter);
router.use('/class/rooms', tableClassRoomsRouter);
router.use('/lessons', tableLessonsRouter);

router.get('/', Authorization, TableController.getTables);

module.exports = router;
