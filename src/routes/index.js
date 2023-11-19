//import router
const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");

router.post("/webhook", webhookController.hookMessageLine);
module.exports = router;
