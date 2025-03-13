const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// ✅ GET: Show Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// ✅ POST: Handle Signup (Fixed)
router.post("/signup", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Signup successful! Welcome!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.render("users/signup.ejs", { error: err.message }); // ✅ Show error message
    }
});

// ✅ GET: Show Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// ✅ POST: Handle Login (Fixed)
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
});

// ✅ GET: Logout (Fixed)
router.get("/logout", async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
