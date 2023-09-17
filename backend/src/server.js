// Import required modules
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes.js");
const requestRoutes = require("./routes/requestRoutes.js");

// Server configuration
const express = require("express");
const app = express();
const PORT = process.env.BACKEND_PORT;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow cross site requests from localhost
app.use(
  cors({
    origin: /^https?:\/\/localhost:/,
  }),
);

// Starts the server
function startServer() {
  try {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();

/**
 * Server Routes
 */

// Index route
app.get("/", (req, res) => {
  res.json({ hi: "from index page!" });
});

// Email confirmation redirect route
app.get("/welcome", (req, res) => {
  try {
    res.json({ welcome: "new user" });
  } catch (err) {
    console.error(err);
  }
});

// Make user routes and request routes available
app.use("/users", userRoutes);
app.use("/requests", requestRoutes);
