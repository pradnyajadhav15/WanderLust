const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const { listingSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const listingController = require("../controllers/listings");

// Middleware to validate listings
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// 📌 Get all listings
router.get("/", wrapAsync(listingController.index));

// 📌 Show form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// 📌 Create a new listing
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// 📌 Show a specific listing
router.get("/:id", wrapAsync(listingController.showListing));

// 📌 Show edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// 📌 Update a listing
router.put("/:id", isLoggedIn, validateListing, wrapAsync(listingController.updateListing));

// 📌 Delete a listing
router.delete("/:id", isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;
