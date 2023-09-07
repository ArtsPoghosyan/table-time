const express = require('express');
const router = express.Router();
const TableController = require("../controllers/TableController.js");
const Authorization = require("../middlewares/authorization.js");

/* GET home page. */
router.get('/create', Authorization, TableController.createTableTime);

/* POST home page. */
router.post('/read', Authorization, TableController.getTableTime);
router.post('/delete', Authorization, TableController.deleteTableTime);

module.exports = router;
