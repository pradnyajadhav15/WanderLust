const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schemas.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware"); 

// Debugging logs
console.log("✅ wrapAsync is loaded:", typeof wrapAsync === "function");
console.log("✅ isReviewAuthor is loaded:", typeof isReviewAuthor === "function");

// ✅ Middleware: Validate Review Data with Joi
const validateReview = (req, res, next) => {
  console.log("📩 Received review data:", req.body); // ✅ Debugging log
  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, msg)); // ✅ Better error handling
  }
  next();
};

// ✅ Post Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    req.flash("success", "New review added!");
    console.log("✅ New review saved:", newReview); // ✅ Debugging log
    res.redirect(`/listings/${listing._id}`);
  })
);

// ✅ Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor, // ✅ Security check: Only author can delete
  wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    console.log("🗑 Review deleted:", reviewId); // ✅ Debugging log
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
