// Using dotenv to load environment variables from a .env file into process.env
const dotenv = require("dotenv");
dotenv.config();

// Importing all required modules and dependencies
const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/dbConfig");
const errorHandler = require("./middlewares/errorHandler");

// Importing route handlers for users, donations, and campaigns
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const campaignRoutes = require("./routes/campaignRoutes");

const app = express();

// Trust reverse proxy for rate limiters & secure headers on Render/Railway
app.set("trust proxy", 1);

// Connect to MongoDB
connectToDB();

// Enabling CORS for all incoming client origins
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Setting up middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting up route handlers for different API endpoints
app.use("/api/donations", donationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);

// Catch-all for unhandled routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    data: null,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Starting the server and listening on the specified port from environment variables
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
