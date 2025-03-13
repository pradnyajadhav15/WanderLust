const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // ✅ Prevent duplicate emails
        match: [/.+@.+\..+/, "Please enter a valid email"], // ✅ Validate email format
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user", // ✅ Optional for role-based access control
    }
});

// ✅ Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
