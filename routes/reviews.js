const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schemas.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews.js");
const validateReview = (req, res, next) => {
  console.log("📩 Received review data:", req.body);

  // Adjust if data is not wrapped inside "review"
  if (!req.body.review) {
    req.body.review = { ...req.body };
  }

  if (!req.body.review.comment || !req.body.review.rating) {
    console.log("🚨 Missing comment or rating:", req.body.review);
    console.log(reviewSchema.validate(req.body.review));
    return next(new ExpressError(400, "Review must include comment and rating"));
  }

  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    console.log("❌ Validation Error:", msg);
    return next(new ExpressError(400, msg));
  }

  next();
};


// ✅ Create Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// ✅ Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;