const express = require("express");
const app = express();
const userRoute = express.Router();

let User = require("../models/users");

userRoute.route("/").get((req, res) => {
  res.json("all users", res.data);
});

userRoute.route("/users").get((req, res) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// taskRoute.route("/edit/:id").put((req, res, next) => {
//   console.log("id", req.params.id, "newtaskname", req.body);
//   Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
//     if (error) {
//       return next(console.error());
//     } else {
//       res.json(data);
//     }
//   });
// });

userRoute.route("/user/:id").get((req, res) => {
  //res.json(req.params.id);
  User.findOne({ id: req.params.id }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

module.exports = userRoute;
