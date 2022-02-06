const express = require("express");
const app = express();
const userRoute = express.Router();

let User = require("../models/users");

userRoute.route("/users").get((req, res) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

userRoute.route("/aqq").get((req, res) => {
  res.send("Hello");
});

module.exports = userRoute;
