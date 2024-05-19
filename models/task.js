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
    dueDate: {
      type: Date,
    },
    isOver: {
      type: Boolean,
    },
    priority: {
      type: Number,
    },
    email: {
      type: mongoose.Schema.Types.String,
      ref: "User"
    },
    description: {
      type: String,
    },
    subTasks: {
      type: Array,
    },
    category: {
      type: mongoose.Schema.Types.Array,
      ref: "Category"
    },
    imagePath: {
      type: String
    }
  },
  {
    collection: "tasks",
  },
  { typeKey: '$type' }
);
module.exports = mongoose.model("Task", Task);
