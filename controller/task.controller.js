const express = require("express");
const app = express();
const taskRoute = express.Router();
const { auth } =require("../middlewares");
let Task = require("../models/task");
var allTasks = "";

fetchAll = (req, res, next) => {
  Task.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      allTasks = data;
      res.json(data);
    }
  });
};

add = (req, res, next) => {
    //console.log("req.body >>>> pppo", req.body);
    Task.create(req.body, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
};

edit = (req, res, next) => {
    //console.log("id", req.params.id, "newtaskname", req.body);
    Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
      if (error) {
        return next(console.error());
      } else {
        res.json(data);
      }
    });
};

task = (req, res, next) => {
    //console.log("Task Detail ID", req.params.id);
    Task.findById(req.params.id, (error, data) => {
      if (error) {
        return next(console.error());
      } else {
        res.json(data);
      }
    });
};

taskStatus = (req, res, next) => {
    Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
      if (error) {
        return next(console.error());
      } else {
        res.json(data);
      }
    });
};

taskDelete = (req, res, next) => {
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
};

module.exports = { fetchAll, add, edit, task, taskStatus, taskDelete};