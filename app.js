const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

// ✅ Import Routes
const listingRoutes = require("./routes/listings.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

// 🌟 Database Connection
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}
main();

// 🌟 Setup EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Serving Static Files
app.use(express.static(path.join(__dirname, "public")));
// ✅ Serve `/uploads` folder explicitly (if images are stored locally)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "data:", "*"], // ✅ Temporary Fix: Allows all images
        "script-src": ["'self'", "https://cdn.jsdelivr.net/", "https://cdnjs.cloudflare.com/"],
      },
    },
  })
);

// ✅ Session Store (MongoDB for persistence)
const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: process.env.SESSION_SECRET || "mysupersecretstring" },
});

const sessionOptions = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "mysupersecretstring",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Middleware to Set Global Variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  console.log("👤 Current User:", res.locals.currUser);
  next();
});

// 🌟 Root Route
app.get("/", (req, res) => {
  res.render("home"); // ✅ Ensure `views/home.ejs` exists
});

// ✅ Use Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// ❗ Handle 404 Errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// ❗ Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { statusCode, message });
});

// 📴 Handle MongoDB Disconnection on Exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("📴 MongoDB Disconnected");
  process.exit(0);
});

// 🚀 Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
