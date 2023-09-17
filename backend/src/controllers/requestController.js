/**
 * This module contains application logic for managing requests for help.
 * It serves as a service provider for the requestRoutes module and
 * interacts with the database through the requestModel module.
 */

const requestModel = require("../models/requestModel.js"); //import the requestModel module
const axios = require("axios"); //import the axios library for making HTTP requests

/**
 *  create new request
 **/
async function createNewRequest(req, res) {
  try {
    const requestData = req.body; //get the request data from the request's body

    //create a new request using the requestModel and await its result
    const newRequest = await requestModel.createNewRequest(requestData);

    //check if the response from createNewRequest indicates a successful request creation
    //prepare http responses
    if (newRequest.data !== null && newRequest.statusText === "Created") {
      res.status(200).json({ "request created!": newRequest.data[0].title });
    } else if (newRequest.error.code === "42501") {
      res.status(403).json({ error: "log in required" }); //send a 403 Forbidden response if login is required
    } else if (newRequest.error !== null) {
      res.status(500).json({ error: newRequest.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}

/**
 * delete request by its unique id
 **/
async function deleteRequestById(req, res) {
  try {
    //check if user session found, indicating that a user is logged in

    const signedInUser = await requestModel.returnUserSession();
    // if no user session found, return a 401 error
    if (signedInUser === null) {
      return res
        .status(401)
        .json({ "request unauthorized": "user login required" });
    }
    const signedInUsersId = signedInUser.id; //get user's unique id

    //extract the request id from the request's query parameter
    const requestId = req.params.requestId;
    //delete the request by its ID using the requestModel
    const requestDeletionError = await requestModel.deleteRequestById(
      signedInUsersId,
      requestId,
    );
    //if request deletion was successful (no error), respond with a success message
    if (requestDeletionError === null) {
      res.status(200).json({ message: "user request deletion sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}

/**
 * update a request by its unique id
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function updateRequestById(req, res) {
  try {
    //check if user session found, indicating that a user is logged in

    const signedInUser = await requestModel.returnUserSession();
    // if no user session found, return a 401 error
    if (signedInUser === null) {
      return res
        .status(401)
        .json({ "request unauthorized": "user login required" });
    }

    // get the ID of the request entry to change from the request parameters
    const requestEntryId = req.params.requestId;

    //create an object with all request entry fields to update and their new values
    const fieldsToUpdate = {};
    for (field in req.body) {
      fieldsToUpdate[field] = req.body[field];
    }

    //update the request entry using the requestModel
    const updatedRequest = await requestModel.updateRequestById(
      requestEntryId,
      fieldsToUpdate,
    );

    //check if the update was successful
    if (updatedRequest.length === 0) {
      //if there was an error or unauthorized access, return a 500 Internal Server Error response
      return res.status(500).json({
        message: "unauthorized or error updating request",
      });
    } else if (updatedRequest.length !== 0) {
      //if the request was successfully updated, log a success message and return a 200 OK response

      console.log(`success! user ${requestEntryId} updated: `, updatedRequest);
      return res.status(200).json({
        message: `'${updatedRequest[0].title}' updated successfully`,
      });
    }
  } catch (error) {
    //handle any errors that occur and return a 500 Internal Server Error response
    console.error(error);
    console.error(error);
    return res.status(500).json({ message: "internal server error", error });
  }
}

/**
 *  view all requests
 * */
async function viewAllRequests(req, res) {
  try {
    //check if user session found, indicating that a user is logged in

    const signedInUser = await requestModel.returnUserSession();
    // if no user session found, return a 401 error
    if (signedInUser === null) {
      return res
        .status(401)
        .json({ "request unauthorized": "user login required" });
    }

    //attempt to retrieve all help requests using the requestModel
    const allRequests = await requestModel.viewAllRequests();
    if (allRequests.data.length !== 0) {
      return res.status(200).json(allRequests.data);
    } //if
    else {
      return res.status(200).json({ message: "no requests for help found" });
    }
  } catch (error) {
    //handle any errors that may occur
    console.error(error);
    return res.status(500).json({ message: "internal server error", error });
  }
}

/**
 * return requests for help matching a requested category
 * @param {*} req
 * @param {*} res
 * @returns
 */

async function getRequestsByCategory(req, res) {
  //check if user session found, indicating that a user is logged in

  const signedInUser = await requestModel.returnUserSession();
  // if no user session found, return a 401 error
  if (signedInUser === null) {
    return res
      .status(401)
      .json({ "request unauthorized": "user login required" });
  }
  //get requested category from incoming http request
  const requestCategory = req.params.category;
  //all requests for help matching category
  const requestsMatchingCategory =
    await requestModel.getRequestsByCategory(requestCategory);
  //handle http response
  if (requestsMatchingCategory.length !== 0) {
    return res.status(200).json(requestsMatchingCategory);
  } else {
    return res
      .status(500)
      .json({ error: "could not retrieve any matching requests for help" });
  }
}

/**
 * return all requests for help within a <10> km radius of user
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getRequestsNearMe(req, res) {
  try {
    //check if user session found, indicating that a user is logged in

    const signedInUser = await requestModel.returnUserSession();
    // if no user session found, return a 401 error
    if (signedInUser === null) {
      return res
        .status(401)
        .json({ "request unauthorized": "user login required" });
    }

    //if session found, get signed in user's postcode

    const signedInUsersPostcode = signedInUser.user_metadata.postcode;

    /**
     * make Zip-API query to return object
     * containing data of all postcodes within a <10> km radius of
     * signed in user
     */

    //Zip-API query url
    const zipAPIUrl = `https://zip-api.eu/api/v1/radius/DE-${signedInUsersPostcode}/10/km`;

    //API GET request
    const { data: dataOfAllPostcodesNearUser } = await axios.get(zipAPIUrl);

    //extract all postcodes
    const postcodesNearUser = [];

    for (const postcode of dataOfAllPostcodesNearUser) {
      if (!postcodesNearUser.includes(postcode.postal_code))
        postcodesNearUser.push(postcode.postal_code);
    }

    // get all help requests matching postcodes near user
    const requestsMatchingPostcodesNearUser =
      await requestModel.getRequestsForHelpMatchingPostcodes(postcodesNearUser);

    if (requestsMatchingPostcodesNearUser.length !== 0) {
      return res.status(200).json(requestsMatchingPostcodesNearUser);
    } else {
      return res
        .status(500)
        .json({ error: "could not retrieve any matching requests for help" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error", error });
  }
}

module.exports = {
  createNewRequest,
  deleteRequestById,
  updateRequestById,
  viewAllRequests,
  getRequestsByCategory,
  getRequestsNearMe,
};
