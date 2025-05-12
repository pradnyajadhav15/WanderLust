const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, bookingSchema, reviewSchema } = require("./schema");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please LogIn");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not Authorized");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not Author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const validateListing = (req, res, next) => {
  console.log(req.body);
  const cleanListing = {
    listing: { ...req.body.listing },
  };
  console.log("new data", cleanListing);
  let { error } = listingSchema.validate(cleanListing);

  if (error) {
    console.log("Errpr isss", error);
    let errMsg = error.details.map((e) => e.message).join(",");
    console.log("errmsg", errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  isReviewAuthor,
  validateListing,
  validateReview,
  validateBooking,
};
