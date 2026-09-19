const express = require("express");
const app = express();

// Using dotenv to load environment variables from a .env file into process.env
const dotenv = require("dotenv");
dotenv.config();

// Importing all required modules and dependencies
const connectToDB = require("./config/dbConfig");

connectToDB();

// Setting up middleware to parse JSON request bodies
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`The server is running on ${process.env.PORT}`);
});
