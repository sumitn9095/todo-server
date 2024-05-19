const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const userRoute = express.Router();
require('dotenv').config();
const { auth } =require("../middlewares");
let User = require("../models/users");
let Hobby = require("../models/hobby");
const nm = require("nodemailer");
// const { RefreshToken } = require("../models/refreshToken.model");
const RefreshToken = require("../models/refreshToken.model");
const { Error } = require("mongoose");
// var { refreshToken: RefreshToken } = RefreshToken;

userRoute.route("/").get((req, res) => {
  res.json("all users", res.data);
});

userRoute.route("/register").post(async(req, res)=> {
  var { username, email, password } = req.body;
  // res.status(200).send({
  //   username, email, password
  // })
  if(password.length < 6) {
    return res.status(400).json({ message : 'Password should be strong'})
  }
  try {

    const transporter = nm.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "sumit.nirgude2@gmail.com",
        pass: "85951055",
      },
    });

    let pw = bcrypt.hashSync(password, 8);

    await transporter.sendMail({
      from: 'sumit.nirgude@gmail.com',
      to: email,
      subject: 'Tasks ToDo Account Verification',
      text: `Click the following link to verify http://localhost:4200/#/tasks/verify/${pw}`
    });

    return;

    await User.create({
      username : username,
      email : email,
      password : pw
    })
    .then(user => {
      const userId = user._id.toString();
      Hobby.create({
        name: "Walking",
        priority: 1
      })
      res.status(200).json({ message : 'User Created successfully', user})
    });
  } catch (err) {
    res.status(401).json({ message : err, error: err})
  }
});

userRoute.route("/signin").post((req, res)=>{
  var { email, password } = req.body;
  User.find({ email : email }) .exec(async (err, user) =>{
  var user = user[0];
   // res.status(200).send({ user : data[0]});
    if(err) {
      return res.status(500).json({ message : err}); 
    }
    if(!user) {
      return res.status(500).json({ message : `User not found with email '${email}'` })
    }
    var pwIsValid = bcrypt.compareSync(password, user.password);
    // res.status(200).send({ pwIsValid, secret121 : process.env.API_SECRET,  userPw : password, userDbPw : user.password});
    // return;
    if(!pwIsValid) return res.status(401).json({ message : 'Invalid password', token : null});
    var token = jwt.sign({id: user._id}, process.env.API_SECRET, {expiresIn : process.env.JWTEXP});
    var rt = await RefreshToken.createToken(user);
    res.status(200).send({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      message: "Login susscessful",
      token: token,
      refreshToken: rt
    })
  })
})


exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, process.env.API_SECRET, {
      expiresIn: process.env.JWTEXP,
    });

    return res.status(200).json({
      token: newAccessToken,
      refreshToken: refreshToken.token,
    });
    
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

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