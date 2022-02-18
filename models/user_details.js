const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User_Details = new Schema(
  {
    id: {
      type: Number,
    },
    details: {
      type: String,
    },
  },

  {
    collection: "user_details",
  }
);

module.exports = mongoose.model("User_Details", User_Details);
