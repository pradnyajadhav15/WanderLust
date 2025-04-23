const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controller/listingController");




const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//GET ALL LISTING
//POST LISTING
router
  .route("/")
  .get(wrapAsync(listingController.allListings))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.newListing)
  );

//RENDER NEW LISTING FORM
//always keep this route above the show route/("/listings/:id") bcs if write below show route then it is conserder "new" as a path parameter so it's not wroking
router.get("/new", isLoggedIn, listingController.renderNewListingForm);

//show route
//Delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.showIndividualListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Edit route
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update route
router.put(
  "/update/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

//search
router.get("/indivisual/search", wrapAsync(listingController.searchListings));
router.get(
  "/feature/order/asc",
  wrapAsync(listingController.sortInAsc)
);
router.get(
  "/feature/order/desc",
  wrapAsync(listingController.sortInDesc)
);

module.exports = router;