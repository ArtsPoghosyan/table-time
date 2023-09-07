const express = require('express');
const router = express.Router();
const Authorization = require("../middlewares/authorization.js");
const SettingsController = require('../controllers/SettingsController.js');

/* POST home page. */
router.post('/update/info', Authorization, SettingsController.updateTableInfo);
router.post('/update/days', Authorization, SettingsController.updateTableDays);
router.post('/update/day/name', Authorization, SettingsController.updateTableDayName);
router.post('/update/hours', Authorization, SettingsController.updateTableDaysHours);
router.post('/update/hour/info', Authorization, SettingsController.updateTableDaysHourInfo);

module.exports = router;
