/**
 * This module contains routes for managing help requests by users
 */

//import required modules
const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

/**
 * create a new help request
 * only works when user is logged in
 */
router.post("/new", async (req, res) => {
  requestController.createNewRequest(req, res);
});
// /**
//  * delete a help request
//  * only works when request was created by user
//  */
router.delete("/delete/:requestId", async (req, res) => {
  requestController.deleteRequestById(req, res);
});
// /**
//  * edit a help request
//  * only works when request was created by user
//  */
router.put("/update/:requestId", async (req, res) => {
  requestController.updateRequestById(req, res);
});
// /**
//  * view all help requests
//  * user can edit or delete requests they created
//  */
router.get("/all", async (req, res) => {
  requestController.viewAllRequests(req, res);
});

router.get("/nearme", async (req, res) => {
  requestController.getRequestsNearMe(req, res);
});
// /**
//  * filter help requests by category
//  * user can edit or delete requests they created
//  */
router.get("/:category", async (req, res) => {
  requestController.getRequestsByCategory(req, res);
});

module.exports = router;
