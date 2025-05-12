const express = require("express");
const { isLoggedIn } = require("../middleware");
const router = express.Router();
const wishlistController = require("../controller/wishlistController.js")


router.post("/add", isLoggedIn, wishlistController.addToWishlist);
router.get("/", isLoggedIn, wishlistController.getWishlist);

module.exports = router;