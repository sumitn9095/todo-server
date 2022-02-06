const express = require("express");
const app = express();
const taskRoute = express.Router();

let Task = require("../models/task");

var allTasks = "";

taskRoute.route("/").get((req, res) => {
  Task.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      allTasks = data;
      res.json(data);
    }
  });
});

taskRoute.route("/task/:id").get((req, res) => {
  let task_id = req.params.id;
  res.json({ data: data, task_id: task_id });
  //Task.find
});

taskRoute.route("/add").post((req, res, next) => {
  console.log("req.body >>>> pppo", req.body);
  Task.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

taskRoute.route("/edit/:id").put((req, res, next) => {
  console.log("id", req.params.id, "newtaskname", req.body);
  Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
    if (error) {
      return next(console.error());
    } else {
      res.json(data);
    }
  });
});

taskRoute.route("/status/:id").put((req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
    if (error) {
      return next(console.error());
    } else {
      res.json(data);
    }
  });
});

taskRoute.route("/delete/:id").delete((req, res, next) => {
  console.log("delete route", req.params.id);
  Task.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = taskRoute;
