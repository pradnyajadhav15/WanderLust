const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');  // Ensure the correct filename
const Review = require('../models/review');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

// Debugging: Ensure middleware functions are imported correctly
console.log({ isLoggedIn, validateReview, isReviewAuthor });

// POST route to create a review
router.post('/', isLoggedIn, validateReview, async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash('error', 'Listing not found!');
            return res.redirect('/listings');
        }

        const review = new Review(req.body.review);
        review.author = req.user._id;
        await review.save();
        listing.reviews.push(review);
        await listing.save();

        req.flash('success', 'Created new review!');
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        next(error);
    }
});

// DELETE route to delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;

        // Ensure the listing exists
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing not found!');
            return res.redirect('/listings');
        }

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash('success', 'Review deleted');
        res.redirect(`/listings/${id}`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
