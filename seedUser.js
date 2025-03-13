const mongoose = require("mongoose");
const User = require("./models/user.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    await createUser();

  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  } finally {
    mongoose.connection.close();
    console.log("📴 MongoDB Disconnected");
  }
}

async function createUser() {
  try {
    const username = "testuser"; // Change if needed
    const email = "test@example.com";
    const password = "testpassword"; // Change if needed

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("⚡ User already exists. Skipping creation.");
      return;
    }

    const user = new User({ username, email });
    await User.register(user, password);

    console.log("✅ User Created Successfully:", user);
  } catch (err) {
    console.error("❌ Error Creating User:", err);
  }
}

main();
