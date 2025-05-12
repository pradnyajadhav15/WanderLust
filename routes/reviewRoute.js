const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controller/reviewController.js")
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
//we need to add this option {mergeParams:true} . ama perent route ma je "id" ave te review ni andar pan avse . jo aa option no hoi to to "id" undefine avse and error throw thase..
//parent route means index.js ma apde reviewRoute ne call karva mate je pela path apyo che te "/listings/:id/review"
//and child route measn aa file ma je path che te "/" for POST and "/:reviewId" FOR DELETE..
const router = express.Router({mergeParams:true});


//review POST route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.reviewPost)
);

//DELETE REVIEW:
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.reviewDelete)
);

module.exports = router;