if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");

const listingsRoute = require("./routes/listingsRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
const bookingRoutes = require("./routes/bookingRoute.js");
const wishlistRoute = require("./routes/wishlistRoute.js");

const User = require("./models/user.js");

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB URL
const dbUrl = process.env.ATLASDB_URL;

// MongoDB session store setup
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO STORE", err);
});

// Session config
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.page = "";
  next();
});

// App setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


// Mongoose connection
mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB is connected"))
  .catch((e) => console.log("Error in MongoDB", e));

// Routes
app.use("/listings", listingsRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);
app.use("/wishlist", wishlistRoute);
app.use("/bookings", bookingRoutes);

// Home route
app.get("/", (req, res) => {
  res.locals.page = "home";
  res.render("Home");
});

// Contact Us
app.get("/contactUs", (req, res) => {
  res.render("Contact");
});
app.post("/contactUs", (req, res) => {
  req.flash("success", "Thanks for contacting us! We'll respond as soon as possible.");
  res.redirect("/listings");
});

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("Error", { statusCode, message });
});

// Start server
app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
