const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: false,
        errorMessage: "Invalid email or password.",
      });
    }

    // Set session data
    req.session.isLoggedIn = true;
    req.session.user = user;

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
  const { email, password, confirmPassword } = req.body;
  // Validate that passwords match
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        isAuthenticated: false,
        errorMessage: "Email already in use!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        isAuthenticated: false,
        errorMessage: "Passwords do not match!",
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the user
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

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
    errorMessage: req.errorMessage,
  });
};
