var express = require('express');
var router = express.Router();
const reportController = require("../controller/reportController");


router.get("/label/status", reportController.status);
module.exports = router;
