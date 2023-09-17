/**
 * This module contains application logic for managing users and authentication
 * It serves as a service provider for the userRoutes module and
 * interacts with the database through the userModel module.
 */

const userModel = require("../models/userModel.js"); //import the userModel module

/**
 * registers a new user
 */
const registerNewUser = async (req, res) => {
  try {
    const userDataFromRequest = req.body;
    // extract user data from request body
    const { firstname, lastname, email, postcode, password } =
      userDataFromRequest;

    const userToRegister = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      postcode: postcode,
      password: password,
    };

    const id_RegisteredUser = await userModel.registerNewUser(userToRegister);
    return res
      .status(201)
      .json({ success: `user ${id_RegisteredUser} created!` });
  } catch (err) {
    console.error(`Error creating user: ${err.message}`);
    return res
      .status(500)
      .json({ error: `could not create user, ${err.message}` });
  }
};

/**
 * signs in a registered user
 **/
async function signInWithEmail(req, res) {
  try {
    const signInCredentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await userModel.signInWithEmail(
      signInCredentials.email,
      signInCredentials.password,
    );
    if (!user) {
      return res.status(401).json({ error: "invalid user credentials" });
    }
    //if user signin successful, redirect to dashboard
    return res.status(302).redirect("http://127.0.0.1:3001/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error", error });
  }
}

/**
 * retrieves registered user details by id
 */
async function retrieveUser(req, res) {
  try {
    const userId = req.params.userId;
    const userDetails = await userModel.retrieveUser(userId); // return data
    const user = {
      firstname: userDetails[0].first_name,
      lastname: userDetails[0].last_name,
      postcode: userDetails[0].postcode,
    };
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "user not found" });
  }
}

/**
 * updates user profile. only works when user is logged in
 **/
async function updateUserProfile(req, res) {
  try {
    const updatedFields = {};
    console.log("updating user data...");
    // create object with new data from request fields
    for (field in req.body) {
      updatedFields[field] = req.body[field];
    }

    const updatedProfile = await userModel.updateUserProfile(updatedFields);

    if (updatedProfile === null) {
      // table error, no user object returned
      return res.status(500).json({
        message: "unauthorized request or error updating user profile",
      });
    } else if (updatedProfile !== null) {
      // user object returned
      const updatedUserData = updatedProfile.user.user_metadata;
      const userId = updatedProfile.user.id;
      console.log(`success! user ${userId} updated: `, updatedUserData);
      return res.status(200).json({
        message: "user profile updated successfully",
        updatedUserData,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error", error });
  }
}

/**
 * sign out current user from session
 */
async function signOut(req, res) {
  try {
    const signOutError = await userModel.signOut();
    if (signOutError === null) {
      return res.status(200).json({ message: "user signed out" });
    } else {
      return res.status(401).json({ error: "unauthorized request" });
    }
  } catch (error) {
    console.log("error thrown");
    console.error(error);
    return res.status(500).json({ message: "error performing sign out" });
  }
}

module.exports = {
  registerNewUser,
  signInWithEmail,
  retrieveUser,
  updateUserProfile,
  signOut,
};
