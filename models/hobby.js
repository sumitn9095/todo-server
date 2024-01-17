const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Hobby = new Schema(
  {
    name: {
      type: String,
    },
    priority: {
      type: Number,
    },
    email: {
        type: mongoose.Schema.Types.String,
        ref: "User"
    }
  },
  {
    collection: "hobbies",
  }
);

module.exports = mongoose.model("Hobby", Hobby);
