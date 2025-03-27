const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js");

// ✅ GET: Show Signup Form
router.get("/signup", userController.renderSignupForm);

// ✅ POST: Handle Signup
router.post("/signup", userController.signup);

// ✅ GET: Show Login Form
router.get("/login", userController.renderLoginForm);

// ✅ POST: Handle Login (Added saveRedirectUrl Middleware)
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;