const express = require("express");
const app = express();
const userDetailsRoute = express.Router();
let User_Details = require("../models/user_details");

userDetailsRoute.route("/details/:id").get((req, res, next) => {
  let user_id = req.params.id;
  console.log(user_id);
  req.json(user_id);
  // User_Details.findById(user_id, (error, data) => {
  //   if (error) {
  //     return next(error);
  //   } else {
  //     res.json(data);
  //   }
  // });
});
module.exports = userDetailsRoute;
