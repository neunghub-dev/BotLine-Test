//import router
const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");
const registerController = require("../controllers/register.controller");
const usersController = require("../controllers/user.controller");
const user = require("../models/user");

router.post("/webhook", webhookController.hookMessageLine);

router.post("/register", registerController.register);

router.patch("/credit/:id", usersController.manageCredit);

router.get("/user", usersController.getAlluser);
module.exports = router;
