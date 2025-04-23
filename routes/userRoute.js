const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/userController.js")
const router = express.Router();

router
  .route("/signup")
  .get(userController.signupRender)
  .post(
    wrapAsync(userController.signup)
  );

router
  .route("/login")
  .get(userController.loginRender)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout",userController.logout );
module.exports = router;