require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/User");

const MONGO_URI = process.env.MONGO_URI;

const makeAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email: "adesunkanmy@gmail.com" },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("User not found.");
    } else {
      console.log(`Admin role assigned to ${user.email}`);
      console.log("Role:", user.role);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

makeAdmin();