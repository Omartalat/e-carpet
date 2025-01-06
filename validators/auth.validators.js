const { body } = require("express-validator");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

const registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email already in use!");
      }
      return true;
    }).normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("You must type a password")
    .isLength({ min: 5 })
    .withMessage("The password must be at least 5 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  body("confirmPassword").trim().custom((value, { req }) => {
    if (!value) {
      throw new Error("Confirm password field is required");
    }
    if (!req.body.password) {
      throw new Error("Password field is required before confirmation");
    }
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),
];

const loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });
      if (!existingUser) {
        throw new Error("Email not found");
      }
      return true;
    }),
  body("password").custom(async (value, { req }) => {
    if (!value) {
      throw new Error("Password is required");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!(await bcrypt.compare(value, user.password))) {
      throw new Error("Invalid password");
    }
    return true;
  }),
];

module.exports = {
  registerValidators,
  loginValidators,
};
