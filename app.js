require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
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

const app = express();

// ✅ Import Routes
const listingRoutes = require("./routes/listings.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysupersecretstring";

// 🌟 Database Connection (Ensuring Connection Before Server Starts)
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1); // Stop server if DB fails
  }
}

// 🌟 Setup EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Serving Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ✅ Helmet Security Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "data:", "*"],
        "script-src": ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      },
    },
  })
);

// ✅ Session Store (MongoDB)
const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: SESSION_SECRET },
});

const sessionOptions = {
  store: sessionStore,
  secret: SESSION_SECRET,
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
  console.log("👤 Current User:", res.locals.currUser ? req.user.username : "Not logged in");
  next();
});

// 🌟 Root Route
app.get("/", (req, res) => {
  res.render("home");
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

// 🚀 Start Server After DB Connection
connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
});
