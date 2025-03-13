const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// ✅ Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "routes", "views"));

// ✅ Middleware for parsing form data & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Serve static files (for images, CSS, JS)
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ Set up session & flash messages
const sessionOptions = {
    secret: "mysuperssecretsring", // Change in production
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());



// 🌟 Middleware: Make flash messages available globally
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ✅ Route to trigger a success flash message
app.get("/success", (req, res) => {
    req.flash("success", "You have successfully registered!");
    res.redirect("/hello");
});

// ✅ Render flash messages in an EJS page
app.get("/hello", (req, res) => {
    res.render("page"); // Ensure `views/page.ejs` exists
});

// ✅ Include users and posts routes
app.use("/users", users);
app.use("/posts", posts);

// 🚀 Start Server
app.listen(3000, () => {
    console.log("✅ Server is running on port 3000");
});
