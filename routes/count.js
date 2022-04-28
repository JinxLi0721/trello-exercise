var express = require('express');
var router = express.Router();
const monthController = require("../controller/monthController");


router.get("/month/createCard", monthController.createCard);

module.exports = router;
