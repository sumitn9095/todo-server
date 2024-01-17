const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TaskDetails = new Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
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
    }
  },
  {
    collection: "taskDetails",
  }
);

module.exports = mongoose.model("TaskDetails", TaskDetails);
