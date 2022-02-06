const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", User);
