//import router
const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");
const registerController = require("../controllers/register.controller");
const usersController = require("../controllers/user.controller");

router.post("/webhook", webhookController.hookMessageLine);

router.post("/register", registerController.register);

router.patch("/credit/:id", usersController.manageCredit);
module.exports = router;
