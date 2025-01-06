const { body } = require("express-validator");

const productValidators = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("imageUrl")
    .notEmpty()
    .withMessage("image URL is required")
    .trim()
    .isURL()
    .withMessage("Please enter a valid URL"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .trim()
    .isFloat()
    .withMessage("Please enter a valid price"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 5, max: 400 })
    .withMessage("Description must be between 5 and 400 characters"),
];
;

module.exports = { productValidators };
