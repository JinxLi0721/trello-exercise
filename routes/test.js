var express = require("express");
var router = express.Router();
const testController = require("../controller/testController");

router.get("/getAllListsName", testController.getAllListsName);

module.exports = router;
