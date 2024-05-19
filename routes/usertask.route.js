const express = require("express");
const app = express();
const userTaskRoute = express.Router();
const userTaskController = require("../controller/usertask.controller");
const { auth } = require("../middlewares");

const uploadTaskPhoto = require("../middlewares/uploadTaskPhoto");
const uploadTasksExcel = require("../middlewares/uploadTasksExcel");

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});

userTaskRoute.route("/usertasks").post([auth.verify], userTaskController.fetchAll );
userTaskRoute.route("/usertasksearch").post([auth.verify], userTaskController.search );
userTaskRoute.route("/usertaskadd").post([auth.verify], userTaskController.add );
userTaskRoute.route("/usertaskedit").put([auth.verify], userTaskController.edit );
userTaskRoute.route("/usertaskinfoanddetail/:id").get([auth.verify], userTaskController.infoAndDetail );
userTaskRoute.route("/usertaskdetail/:id").get([auth.verify], userTaskController.detail );
userTaskRoute.route("/usertaskdetailssave").post([auth.verify], uploadTaskPhoto.single('taskphoto'), userTaskController.detailsSave );
userTaskRoute.route("/usertaskdelete/:id").delete([auth.verify], userTaskController.taskDelete );
userTaskRoute.route("/userstatustoggle").put([auth.verify], userTaskController.statusToggle );
userTaskRoute.route("/downloadTasks").post([auth.verify], userTaskController.downloadTasks );
userTaskRoute.route("/uploadTasks").post([auth.verify], uploadTasksExcel.single("taskexcel"), userTaskController.uploadTasks );
userTaskRoute.route("/userRemoveImg/:id").get([auth.verify], userTaskController.removeImg );
userTaskRoute.route("/countDocuments").post([auth.verify], userTaskController.countDocumentsInCollection );

module.exports = userTaskRoute;

