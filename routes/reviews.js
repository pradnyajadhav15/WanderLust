const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schemas.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews.js");

// ✅ Middleware to validate review data
const validateReview = (req, res, next) => {
  console.log("📩 Received review data:", req.body); // Debugging log

  if (!req.body.review || !req.body.review.text || !req.body.review.rating) {
    return next(new ExpressError(400, "Review must include text and rating"));
  }

  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, msg));
  }
  next();
};

// ✅ Create Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// ✅ Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
