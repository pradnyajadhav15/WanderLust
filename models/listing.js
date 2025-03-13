const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    images: [ 
      {
        url: String,
        filename: String,
      },
    ],
    price: { type: Number, required: true, min: 0, default: 100 },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;