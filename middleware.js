const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // ✅ Save the requested URL before redirecting
    req.flash("error", "You must be logged in to continue!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!req.user || review.author.toString() !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // ✅ Clear redirect URL only if it exists
  } else {
    res.locals.redirectUrl = "/";
  }
  next();
};
