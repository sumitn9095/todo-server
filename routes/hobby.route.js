const express = require("express");
const app = express();
const hobbyRoute = express.Router();
const hobbyController = require("../controller/hobby.controller");
const { auth } = require("../middlewares");
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});
hobbyRoute.route("/").post([auth.verify], hobbyController.getUser );
hobbyRoute.route("/userhobbies").post([auth.verify], hobbyController.fetchAll );
hobbyRoute.route("/userhobbyadd").post([auth.verify], hobbyController.add );
hobbyRoute.route("/userhobbyremove").post([auth.verify], hobbyController.hobbyremove );
module.exports = hobbyRoute;