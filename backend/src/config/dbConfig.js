const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connnecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDB;
