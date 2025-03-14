const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (!req.body.review || !req.body.review.text || !req.body.review.rating) {
      req.flash("error", "Review must have text and rating!");
      return res.redirect(`/listings/${listing._id}`);
    }

    const newReview = new Review({
      text: req.body.review.text,
      rating: req.body.review.rating,
      author: req.user._id,
      listing: listing._id
    });

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "New review added!");
    console.log("✅ New review saved:", newReview);
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("❌ Error creating review:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
};

module.exports.destroyReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    req.flash("success", "Review deleted!");
    console.log("🗑 Review deleted:", reviewId);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
};
