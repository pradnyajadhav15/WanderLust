const Wishlist = require("../models/wishlist");
const Listing = require("../models/listing");

module.exports.addToWishlist = async (req, res) => {
  const { listingId } = req.body;
  const userId = req.user._id;

  const existing = await Wishlist.findOne({ user: userId, listing: listingId });
  if (existing) {
    await Wishlist.findByIdAndDelete(existing._id);
    return res.json({ success: true, action: "removed" });
  } 
  else {
    await Wishlist.create({ user: userId, listing: listingId });
    return res.json({ success: true, action: "added" });
  }
};

module.exports.getWishlist = async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id }).populate(
    "listing"
  );
  const allListings = wishlistItems.map((item) => item.listing);
  res.render("wishlist/index", { allListings, page: "allListingPage" });
};