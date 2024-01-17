const express = require("express");
const app = express();
const taskRoute = express.Router();
const { auth } =require("../middlewares");
let Task = require("../models/task");
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const fs = require('fs');
const path = require('path');
var allTasks = "";

getUser = async(req, res, next) => {
  return User.findOne({ email : req }).exec();
}

saveTasks = () => {
  fs.writeFile('./dd.txt', 'dasdsadad\n',{flag : 'a'},(err)=>{
    if(err) console.log('some errorrrrrrrrrr',err);
    else console.log('file write successful');
  })
}

myEmitter.on('newTaskAdded', saveTasks);

myEmitter.emit('newTaskAdded');

fetchAll = (req, res, next) => {
  Task.find({ email: req.body.email}, (error, data) => {
    if (error) {
      return next(error);
    } else {
     
      res.status(200).send({data, message: "Tasks successfully retrieved"});
    }
  });
};

add = async(req, res, next) => {
    // const user = await getUser();
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