const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name not provided"]
    },
    email: {
      type: String,
      unique: [true, "Email already exists in db"],
      lowercase: true,
      trim: true,
      required: [true, "Email not provided"],
      validate: {
        validator: (v) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'This is not a valid email!'
      },
    },
    password: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    },
    verifySecret: {
      type: String,
      default: ""
    },
    resetSecret: {
      type: String,
      default: ""
    },
    verifyStatus: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", User);
