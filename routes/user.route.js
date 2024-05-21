const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const userRoute = express.Router();
require('dotenv').config();
const { auth } =require("../middlewares");
let User = require("../models/users");
let Hobby = require("../models/hobby");
const nodemailer = require("nodemailer");
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

  try {
  
  User.findOne({ email : email}, (err,data) => {
      if(err) return res.status(200).send({message: 'Email already exists'});
      // else return res.status(500).send({message: 'Email already exists'});
  });

  if(password.length < 6) {
    return res.status(400).json({ message : 'Password should be strong'})
  }


    let otp = bcrypt.hashSync(password, 10);
    let pw = bcrypt.hashSync(password, 8);

    await User.create({
      username : username,
      email : email,
      verifySecret : otp,
      verifyStatus : false,
      password : pw
    })
    .then(user => {
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "sumit.nirgude2@gmail.com",
          pass: "srrs gkmh milb rhfy",
        },
      });

      // var transporter = nodemailer.createTransport({
      //   host: "sandbox.smtp.mailtrap.io",
      //   port: 2525,
      //   auth: {
      //     user: "f90af798e87040",
      //     pass: "75048911b98892"
      //   }
      // });

      const configObj = {
        from: 'sumit.nirgude2@gmail.com',
        to: email,
        subject: 'Tasks ToDo Account Verification',
        text: `Click the following link to verify http://localhost:4200/#/auth/verify/${email}/${otp}`
      }

      transporter.sendMail(configObj, (error,info) => {
        if (error) {
          console.log('Error',error);
          res.status(500).send({ error });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send({ message : 'User Created successfully', user});
        }
        // if (err) {
        //   return res.status(500).json({ message : err});
        // } else {
        //   return res.status(200).json({ message : 'Email sent successfully', info});
        // }
      });

      //
    });
  } catch (err) {
    //res.status(401).send({ message : err, error: err})
  }
});

userRoute.route("/verifyemail").post((req, res) => {
  var { email, verifySecret } = req.body;
  try {
    User.find({ email : email }) .exec(async (err, user) =>{
      var user = user[0];

     
      // res.status(200).send({ user : data[0]});
        if(err) {
          return res.status(500).send({ message : err});
        }
        if(!user) {
          return res.status(500).send({ message : `User not found with email '${email}'` })
        }

          User.findOneAndUpdate({ verifySecret: verifySecret, verifyStatus: false}, {$set: {verifyStatus: true, verifySecret: ""}}, {$unset: {verifySecret: 1}}) .exec(async (verifyErr, verifyData) => {
            console.log("verifyData", verifyData)

            if(verifyErr) {
              return res.status(500).send(err);
            }

            if(!verifyData) return res.status(500).send({ message : `User verified already`});
            else res.status(200).send({ message : `User verified successfully` });

              // if(verifyErr) {
              //   return res.status(500).send({err, message: "User verified already"});
              // }
              // else return res.status(200).send({message: 'User Verified Successfully'});
          });
        
    });
  } catch (err) {
    console.error(err);
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