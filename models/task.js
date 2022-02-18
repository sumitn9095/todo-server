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
    priority: {
      type: Number,
    },
  },
  {
    collection: "tasks",
  }
);

module.exports = mongoose.model("Task", Task);
