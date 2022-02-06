const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Task = new Schema(
  {
    taskname: {
      type: String,
    },
    date: {
      type: Date,
    },
    isOver: {
      type: Boolean,
    },
  },
  {
    collection: "tasks",
  }
);

module.exports = mongoose.model("Task", Task);
