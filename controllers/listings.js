const Listing = require("../models/listing");


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });




// 📌 Get all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// 📌 Show form for new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// 📌 Create a new listing
module.exports.createListing = async (req, res, next) => {

  let response =  await geocodingClient.forwardGeocode({
    query:  req.body.listing.location,
    limit: 1
  })
    .send()
    

  let url = req.file.path;
  let filename = req.file.filename;

  if (!req.body.listing) {
    req.flash("error", "Invalid listing data!");
    return res.redirect("/listings/new");
  }
  req.body.listing.image = req.body.listing.image || "https://via.placeholder.com/300";
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Assign the owner
  newListing.image = {url, filename};

  
newListing.geometry = response.body.features[0].geometry;
  
  
let savedListing = await newListing.save();
console.log(savedListing)
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

// 📌 Show a specific listing
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

// 📌 Show edit form for a listing
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing Not Found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }

  res.render("listings/edit", { listing });
};

// 📌 Update a listing
module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing Not Found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }

  let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url, filename};
    await listing.save();


  await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// 📌 Delete a listing
module.exports.deleteListing = async (req, res, next) => {
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
};
