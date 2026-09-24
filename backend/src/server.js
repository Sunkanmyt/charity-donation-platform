// Using dotenv to load environment variables from a .env file into process.env
const dotenv = require("dotenv");
dotenv.config();

// Importing all required modules and dependencies
const express = require("express");
const cors = require("cors");

const connectToDB = require("./config/dbConfig");

// Importing route handlers for users, donations, and campaigns
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const campaignRoutes = require("./routes/campaignRoutes");

const app = express();

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

// Setting up route handlers for different API endpoints
app.use("/api/donations", donationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);

// Starting the server and listening on the specified port from environment variables
app.listen(process.env.PORT, () => {
  console.log(`The server is running on PORT ${process.env.PORT}`);
});
