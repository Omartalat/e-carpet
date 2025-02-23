const express = require("express");

const { check, body } = require("express-validator");

const validators = require("../validators/auth.validators");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", ...validators.loginValidators, authController.postLogin);

router.post(
  "/signup",
  ...validators.registerValidators,
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
