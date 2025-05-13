const { Schema, model, set, default: mongoose } = require("mongoose");
const Review = require("./review");
const wishlist = require("./wishlist");
const booking = require("./booking");

mongoose.set("runValidators",true);

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  
  image: {
    type: {
      url: { type: String, required: true },
      filename: { type: String, default: "default-image-name" },
    },
    default: {
      url: "https://images.unsplash.com/photo-1735597693189-9ba81b5bbc83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "default-image",
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  coordinates:{
    type:[Number],
    required : true
  }
});

//mongoose middleware ....write it before model creation

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    // Delete associated reviews
    if (listing.reviews.length) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

    // Delete associated wishlist entries
    await wishlist.deleteMany({ listing: listing._id });

    // Delete associated bookings
    await booking.deleteMany({ listing: listing._id });
  }
});

const Listing = model("Listing", listingSchema);

module.exports = Listing;


