if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const crypto = require("crypto");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

const app = express();

// Import Routes
const listingRoutes = require("./routes/listings.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

// Database URL
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysupersecretstring";

// Database Connection

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log(" MongoDB Connected:", dbUrl);
  } catch (err) {
    console.error(" DB Connection Error:", err);
    process.exit(1);
  }
}

// Setup EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Serving Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Generate Nonce for Each Request
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});


// Helmet Security with Correct CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://api.mapbox.com",  // Allow script requests to Mapbox
          (req, res) => `'nonce-${res.locals.nonce}'`,
        ],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://api.mapbox.com",  // Add this line to allow Mapbox styles
          "'unsafe-inline'",  // Retain this if needed for inline styles
        ],
        imgSrc: ["'self'", "data:", "*"],
        connectSrc: [
          "'self'",
          "https://api.mapbox.com",
          "https://events.mapbox.com",
        ],
        workerSrc: ["'self'", "blob:"],
      },
    },
  })
);


//  Session Store (MongoDB) (Fix: Using dbUrl correctly)
const store = MongoStore.create({
  mongoUrl: dbUrl, //  Fixed: dbUrl is now properly defined
  crypto: {
    secret: SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Reduce write frequency
});

// Handle session store errors
store.on("error", (err) => {
  console.log("Mongo Session Error:", err);
});

// Session Configuration
const sessionOptions = {
  store: store, // Fixed: Using correct store variable
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to Set Global Variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Ensure currUser is always set
  console.log("👤 Current User:", req.user ? req.user.username : "Not logged in");
  next();
});

// Use Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Handle 404 Errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { statusCode, message });
});

//  Handle MongoDB Disconnection on Exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log(" MongoDB Disconnected");
  process.exit(0);
});

//  Start Server After DB Connection
connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
  });
});
