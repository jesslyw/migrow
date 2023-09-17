/**
 * This module contains routes for managing users and authentication
 */

// Import required modules
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requestModel = require("../models/requestModel.js");

// register new user
router.post("/register", async (req, res) => {
  try {
    const newUserId = await userController.registerNewUser(req, res);
  } catch (error) {
    console.error("could not register new user: ", error);
  }
});

// sign in registered user with email and password
router.post("/signin", (req, res) => {
  try {
    userController.signInWithEmail(req, res);
  } catch (error) {
    console.error("could not sign in user: ", error);
  }
});

// retrieve user session, null if none found
router.get("/get-session", async (req, res) => {
  try {
    const userSession = await requestModel.returnUserSession();
    return res.status(200).json({ session: userSession });
  } catch (error) {
    console.error("could not retrieve user session: ", error);
  }
});

// retrieve registered user's details
router.get("/:userId", async (req, res) => {
  try {
    userController.retrieveUser(req, res);
  } catch (error) {
    console.error("could not retrieve user: ", error);
  }
});

// update user profile when logged in
router.put("/update", async (req, res) => {
  try {
    userController.updateUserProfile(req, res);
  } catch (error) {
    console.error("could not update profile: ", error);
  }
});

// user sign out
router.post("/signout", async (req, res) => {
  try {
    userController.signOut(req, res);
  } catch (error) {
    console.error("endpoint error: ", error);
  }
});

module.exports = router;
