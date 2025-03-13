const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schemas.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Middleware to validate listings
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

router.get("/", async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index", { allListings });
});



// Get all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// Show form for new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show a specific listing
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: { 
        path: "author",
    },
  })
    .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing, currUser: req.user });
  })
);

// Create a new listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      req.flash("error", "Invalid listing data!");
      return res.redirect("/listings/new");
    }
    req.body.listing.image = req.body.listing.image || "https://via.placeholder.com/300";
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Assign owner to the listing
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  })
);

// Edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

// Update listing
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to edit this listing");
      return res.redirect(`/listings/${id}`);
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete listing
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete this listing");
      return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
