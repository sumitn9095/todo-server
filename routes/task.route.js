const express = require("express");
const app = express();
const taskRoute = express.Router();
const taskController = require("../controller/task.controller");
const { auth } =require("../middlewares");
let Task = require("../models/task");

var allTasks = "";

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
taskRoute.route("/tasks").get([auth.verify], taskController.fetchAll );
taskRoute.route("/add").post([auth.verify], taskController.add );
taskRoute.route("/edit/:id").put([auth.verify], taskController.edit );
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
taskRoute.route("/task/:id").put([auth.verify], taskController.task );
// taskRoute.route("/task/:id").get((req, res, next) => {
//   console.log("Task Detail ID", req.params.id);
//   Task.findById(req.params.id, (error, data) => {
//     if (error) {
//       return next(console.error());
//     } else {
//       res.json(data);
//     }
//   });
// });
taskRoute.route("/status/:id").put([auth.verify], taskController.taskStatus );
// taskRoute.route("/status/:id").put((req, res, next) => {
//   Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
//     if (error) {
//       return next(console.error());
//     } else {
//       res.json(data);
//     }
//   });
// });
taskRoute.route("/delete/:id").put([auth.verify], taskController.taskDelete );

module.exports = taskRoute;
