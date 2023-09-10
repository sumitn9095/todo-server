const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const userRoute = express.Router();
require('dotenv').config();
const { auth } =require("../middlewares");
let User = require("../models/users");

userRoute.route("/").get((req, res) => {
  res.json("all users", res.data);
});

userRoute.route("/register").post(async (req, res)=> {
  var { username, email, password } = req.body;
  // res.status(200).send({
  //   username, email, password
  // })
  if(password.length < 6) {
    return res.status(400).json({ message : 'Password should be strong'})
  }
  try {
    await User.create({
      username : username,
      email : email,
      password : bcrypt.hashSync(password, 8)
    })
    .then(user => res.status(200).json({ message : 'User Created successfully', user}));
  } catch (err) {
    res.status(401).json({ message : err, error: err})
  }
});

userRoute.route("/signin").post((req, res)=>{
  var { email, password } = req.body;
  User.find({ email : email }, (error, data)=>{
  var user = data[0];
   // res.status(200).send({ user : data[0]});
    if(error) {
      res.status(500).json({ message : error});
    }
    if(!user.username) {
      res.status(500).json({ message : 'User not found' })
    }
    var pwIsValid = bcrypt.compareSync(password, user.password);
    // res.status(200).send({ pwIsValid, secret121 : process.env.API_SECRET,  userPw : password, userDbPw : user.password});
    // return;
    if(!pwIsValid) return res.status(401).json({ message : 'Invalid password', token : null});
    var token = jwt.sign({
      id: user._id
    }, process.env.API_SECRET, {
      expiresIn : 86400
    });

    res.status(200).send({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      message: "Login susscessful",
      token: token
    })
  })
})

userRoute.route("/").get((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})
userRoute.route("/verify").get(auth.verify);

// userRoute.route("/users").get((req, res) => {
//   User.find((error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// userRoute.route("/user/:id").get((req, res) => {
//   //res.json(req.params.id);
//   User.findOne({ id: req.params.id }, (error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

module.exports = userRoute;