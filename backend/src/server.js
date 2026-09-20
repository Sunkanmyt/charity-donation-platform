const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDB = require("./config/dbConfig");

const app = express();

// Using dotenv to load environment variables from a .env file into process.env
dotenv.config();

// Importing all required modules and dependencies
connectToDB();

// Enabling CORS for all incoming client origins
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Setting up middleware to parse JSON request bodies
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`The server is running on ${process.env.PORT}`);
});
