/**
 * This module contains database functions for managing requests for help
 * using the Supabase-js library
 * It serves as a service provider for the requestModel module
 */

//import the database module
const supabase = require("../db/db.js");

/**
 * register a new user via email
 * returns: new user uuid
 **/
const registerNewUser = async (newUserObject) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: newUserObject.email,
      password: newUserObject.password,
      options: {
        data: {
          first_name: newUserObject.firstname,
          last_name: newUserObject.lastname,
          postcode: newUserObject.postcode,
        },
      },
    });
    const newUserId = data.user.id;
    console.log("returned user:", data);
    return newUserId;
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * sign in a registered user
 */
const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error("Error during sign-in: Invalid credentials");
    }
    // User logged in successfully
    return data.user;
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * retrieve user details
 * @param {*} userId
 * @returns firstname, lastname, postcode of a registered user
 */
const retrieveUser = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("first_name, last_name, postcode")
      .eq("auth_id", userId);

    return user;
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * updates metadata in auth.users with updatedFields object
 * if user signed in, returns updatedUser object
 * if user not signed in or other error, returns null
 **/
const updateUserProfile = async (updatedFields) => {
  try {
    const { data: updatedUser, error } = await supabase.auth.updateUser({
      data: updatedFields,
    });
    if (updatedUser !== null && error === null) {
      // metadata updated
      return updatedUser;
    } else if (error !== null) {
      // error returned
      console.error(error.message); //log error
      return null;
    }
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * sign out current user from session
 */
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    return error;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  registerNewUser,
  signInWithEmail,
  retrieveUser,
  updateUserProfile,
  signOut,
};
