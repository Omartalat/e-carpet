const crypto = require("crypto");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();
// Import the Nodemailer library
const nodemailer = require("nodemailer");
const path = require("path");
// const { buffer } = require("stream/consumers");
// const { constrainedMemory } = require("process");

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false, // use SSL
  auth: {
    user: process.env.EMAIL_API_USER,
    pass: process.env.EMAIL_API_PASS,
  },
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.message,
    oldInput: {
      email: '',
      password: ''
    },
    isAuthenticated: false,
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    isAuthenticated: false,
    validationErrors: []
  });
}

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      isAuthenticated: false,
      validationErrors: errors.array()
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Set session data
    req.session.isLoggedIn = true;
    req.session.user = user;

    // Save session and redirect
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: false,
          errorMessage: "An error occurred. Please try again later.",
        });
      }
      res.redirect("/");
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      errorMessage: "An error occurred. Please try again later.",
    });
  }
};

// User.findById("6762f7327ec56ecbf6e2ef09")
//   .then((user) => {
//     req.session.isLoggedIn = true;
//     req.session.user = user;
//     req.session.save((err) => {
//       console.log(err);
//       res.redirect("/");
//     });
//   })
//   .catch((err) => console.log(err));
//};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      isAuthenticated: false,
      validationErrors: errors.array()
    });
  }
  // Validate that passwords match
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the user
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const mailOptions = {
      from: "demo@demomailtrap.com",
      to: "dr.omartalat@gmail.com",
      subject: "Account created",
      text: "That was easy!",
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Redirect to the login page on successful signup
    res.status(201).redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: "An error occurred. Please try again later.",
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage: req.errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.render("auth/reset", {
          path: "/reset",
          pageTitle: "Reset Password",
          isAuthenticated: false,
          errorMessage: "No account with that email found!",
        });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      const mailOptions = {
        from: "demo@demomailtrap.com",
        to: "dr.omartalat@gmail.com",
        subject: "Password reset",
        html: `
        <p>You requested a password reset<p>
        <p>Click this <a href="http://localhost:3000/reset/${token}" >link<a> to reset your password<p>
        `,
      };

      // Send the email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.status(500).render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: false,
        errorMessage: "An error occurred. Please try again later.",
        token: token,
        userId: userId,
      });
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        isAuthenticated: false,
        errorMessage: "Invalid or expired token.",
      });
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      isAuthenticated: false,
      errorMessage: req.errorMessage,
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;
  try {
    const restUser = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    if (!restUser) {
      return res.status(400).render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: false,
        errorMessage: "Invalid or expired token.",
        userId: userId,
        token: token,
      });
    }

    restUser.password = await bcrypt.hash(newPassword, 12);
    restUser.resetToken = undefined;
    restUser.resetTokenExpiration = undefined;

    await restUser.save();

    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
