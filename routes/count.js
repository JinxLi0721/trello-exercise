var express = require('express');
var router = express.Router();
const monthController = require("../controller/monthController");


router.get("/month/createCard", monthController.createCard);
router.get("/month/updateCard/:id", monthController.updateCard);
router.get("/month/updateCardAll", monthController.updateCardAll);
router.get("/month/deleteCard", monthController.deleteCard);
router.get("/month/date/:action", monthController.date);
router.get("/month/card/:id", monthController.card);
module.exports = router;
