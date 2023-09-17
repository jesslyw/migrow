/**
 * This module contains database functions for managing users and authentication
 * using the Supabase-js library
 * It serves as a service provider for the userModel module
 */

//import the database module
const supabase = require("../db/db.js");

/**
 * Functions to directly interact with the postgres database using Supabase,
 * related to managing requests for help
 **/

/**
 * return a user session with Supabase, or null if user session not found (user not signed in)
 **/
async function returnUserSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * create a new request for help using Supabase
 * @param {*} requestData object containing data for the new request
 * @returns the newly created request
 */
async function createNewRequest(requestData) {
  try {
    const newRequest = await supabase
      .from("requests")
      .insert([
        {
          title: requestData.title,
          description: requestData.description,
          category_id: requestData.category_id,
        },
      ])
      .select();

    return newRequest;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

/**
 * delete a request for help by its unique id using Supabase
 *
 * @param {string} requestId - unique id of the request to be deleted
 * @param {string} signedInUsersId - unique id of the signed in user
 * @returns {string|null} - returns an error message if deletion fails, or null if successful
 */
async function deleteRequestById(signedInUsersId, requestId) {
  //attempt to delete a request with the specified id from the "requests" table in Supabase
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  //return the error message if there was an error during deletion, or null if successful
  return error;
}

/**
 * update a request by its unique ID with the specified fields using Supabase
 *
 * @param {string} requestId - unique ID of the request to be updated
 * @param {Object} updatedFields - an object containing the fields to update and their new values
 * @returns {Object|null} - returns the updated request data if successful, or null if an error occurs
 */
async function updateRequestById(requestId, updatedFields) {
  //attempt to update the request with the specified ID and fields in the "requests" table using Supabase
  const { data: updatedRequest, error } = await supabase
    .from("requests")
    .update(updatedFields)
    .eq("id", requestId)
    .select();

  if (updatedRequest !== null && error === null) {
    //if update is successful and there are no errors, return the updated request data
    return updatedRequest;
  } else if (error !== null) {
    //if an error occurred during the update, log the error and return null
    console.error(error.message);
    return null;
  }
}

/**
 * function to retrieve all requests for help using Supabase
 * @returns all requests
 */
async function viewAllRequests() {
  let res = await supabase
    .from("requests")
    .select(
      "id, title, description, category_id, postcode, users(first_name, last_name) ",
    );
  console.log(res);
  return res;
}

/**
 * function to retrieve all requests by selected request category
 * @param {*} category
 * @returns all matching requests
 */
async function getRequestsByCategory(category) {
  //retrieve id of the requested category

  const result = await supabase
    .from("categories")
    .select("id")
    .eq("category", category);

  const category_id = result.data[0].id;

  //retrieve requests matching the id of the requested category
  const requests = await supabase
    .from("requests")
    .select(
      "id, title, description, category_id, postcode, users(first_name, last_name) ",
    )
    .eq("category_id", category_id);

  return requests.data;
}

/**
 * function to retrieve all requests for help within a <10> km radius of user
 * @param {*} postcodes list of postcodes within <10> km of signed in user
 * @returns matching requests
 */
async function getRequestsForHelpMatchingPostcodes(postcodes) {
  const requestsForHelpMatchingPostcodes = [];
  const requestPromises = [];

  //asynchronously make a database call for each postcode to retrieve matching requests
  for (let i = 0; i < postcodes.length; i++) {
    //create a promise for each call
    const requestPromise = supabase
      .from("requests")
      .select(
        "id, title, description, category_id, postcode, users(first_name, last_name) ",
      )
      .eq("postcode", postcodes[i])
      .then((response) => {
        if (response.data.length !== 0) {
          requestsForHelpMatchingPostcodes.push(response.data[0]);
        }
      });
    requestPromises.push(requestPromise);
  }

  //wait for all promises to resolve
  await Promise.all(requestPromises);

  return requestsForHelpMatchingPostcodes;
}

module.exports = {
  createNewRequest,
  deleteRequestById,
  updateRequestById,
  viewAllRequests,
  getRequestsByCategory,
  returnUserSession,
  getRequestsForHelpMatchingPostcodes,
};
