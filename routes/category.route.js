const express = require("express");
const app = express();
const categoryRoute = express.Router();
const categoryController = require("../controller/category.controller");
const { auth } = require("../middlewares");
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});
categoryRoute.route("/usercategories").post([auth.verify], categoryController.fetchAll );
categoryRoute.route("/usercategoryadd").post([auth.verify], categoryController.add );
categoryRoute.route("/usercategoryremove").post([auth.verify], categoryController.remove );
module.exports = categoryRoute;