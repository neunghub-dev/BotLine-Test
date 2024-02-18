//import router
const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");
const registerController = require("../controllers/register.controller");
const usersController = require("../controllers/user.controller");
const adminController = require("../controllers/admin.controller");
const authController = require("../controllers/auth.controller");
const transactionController = require("../controllers/transaction.controller");
const userAdminController = require("../controllers/users_admin.controller");
const partnerController = require("../controllers/partner.controller");
const authJwt = require("../middleware/authJwt");

router.post("/webhook", webhookController.hookMessageLine);

router.post("/register", registerController.register);

router.patch(
  "/credit/:id",
  [authJwt.verifyToken],
  usersController.manageCredit
);

router.get("/user", [authJwt.verifyToken], usersController.getAlluser);
router.patch("/user/:id", [authJwt.verifyToken], usersController.updateUser);
router.post("/auth/login", authController.login);
router.post("/user", [authJwt.verifyToken], usersController.createUser);
router.get("/admin", [authJwt.verifyToken], usersController.getAllAdmin);
router.get("/profile", [authJwt.verifyToken], adminController.getProfile);
router.get("/user/invite", userAdminController.adduserAdmin);

router.get(
  "/transaction",
  [authJwt.verifyToken],
  transactionController.getAllTransaction
);
router.get(
  "/transaction/date",
  [authJwt.verifyToken],
  transactionController.getAllTransactionByDate
);
router.get(
  "/transaction/:id",
  [authJwt.verifyToken],
  transactionController.getAllTransactionByPartner
);
router.get("/partner", partnerController.getAllPartners);
router.get("/partners", partnerController.getPartnerByRefCode);
router.get("/useradmin", [authJwt.verifyToken], userAdminController.getAllUser);
router.delete("/useradmin/:id", userAdminController.destroyUser);
router.put("/users/commision", usersController.addCommision);

module.exports = router;
