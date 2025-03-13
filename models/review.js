const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true }, // ✅ Optional, but improves query efficiency
  },
  { timestamps: true } // ✅ Replaces manual createdAt field
);

module.exports = mongoose.model("Review", reviewSchema);
