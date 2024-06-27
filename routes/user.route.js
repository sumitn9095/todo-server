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
const hbs = require("nodemailer-express-handlebars");


// const { RefreshToken } = require("../models/refreshToken.model");
const RefreshToken = require("../models/refreshToken.model");
const { Error } = require("mongoose");
// var { refreshToken: RefreshToken } = RefreshToken;

userRoute.route("/").get((req, res) => {
  res.json("all users", res.data);
});

const sendEmail = async(email, type,successMssg, userData,otp,res) => {

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "sumit.nirgude2@gmail.com",
      pass: "srrs gkmh milb rhfy",
    },
  });

  const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
  };

  let link = `http://localhost:4200/#/auth/${type === 'register' ? 'verify' : 'forgot-password' }/${email}/${otp}`;

  transporter.use('compile', hbs(handlebarOptions))
  const configObj = {
    from: 'sumit.nirgude2@gmail.com',
    to: email,
    template: "../email/index",
    subject: `${type === 'register' ? 'Account Verification' : 'Account Forgot Password Reset'}`,
    context: {
      title: `${type === 'register' ? 'Account Verification' : 'Account Forgot Password Reset'}`,
      link: link,
      message: `Hello ${email}, Please click this link to verify ${type === 'register' ? 'your account' : 'the forgot password request created by you'} ${link}, or click the below button.`
    }
  }

  transporter.sendMail(configObj, (error,info) => {
    if (error) {
      res.status(500).send({ error });
    } else {
      res.status(200).send({ message : successMssg, userData});
    }
  });
}


// Reset Password --------
userRoute.route("/reset").post(async(req,res)=>{
  var {email, password0, password, password2} = req.body;
  User.find({email: email},(err,data)=>{
    if(err) return res.status(500).send({message: 'Email doesnt exists'});
    if(password0 !== data.password) return res.status(500).send({message: 'Current password not matching'});
    else {
      if(password !== password2) return res.status(500).send({message: 'New password not matching'});
      res.status(200).send({message: 'Password Reset Successful'});
    }
  })
})

// Forget Password ---------
// Forget Password -- 1. Send reset password link to 'email'
userRoute.route("/forgotPassword").post(async(req, res)=> {
  var { email } = req.body;
  let otp = generateUrlOtp(email);
  //console.log("otp",otp)
  try {
    User.findOneAndUpdate({ email : email}, { $set: { resetSecret: otp} }, (err,data) => {
        //console.log("forgotPassword",err,data)
        if(err) return res.status(500).send({message: 'Email doesnt exists'});
        else {
          sendEmail(email, 'forgotPassword','Account Forgot Password Reset link created', data, otp, res);
        }
    });
  } catch (err) {
    console.error(err);
  }
});
// Forget Password -- 2. Verify the Forget password URL link, when link clicked
userRoute.route("/verifyforgetpassword").post((req, res) => {
  var { email, resetSecret } = req.body;
  try {
    User.find({ email : email }) .exec(async (err, user) => {
        var user = user[0];
        if(err) return res.status(500).send({ message : err});
        if(!user) return res.status(500).send({ message : `User not found with email '${email}'` });
        User.find({ email : email, resetSecret: resetSecret},(err, verifyData) => {
          let data = verifyData[0];
          console.log("Reset Data", data);
          if(err) return res.status(500).send(err);
          if(!data) return res.status(500).send({ message : `Account Password Reseted already. For reseting the account password, geenrate and send the reset link again.`});
          else res.status(200).send({ message : `Forgot Password Request Verified` });
        });
    });
  } catch (err) {
    console.error(err);
  }
});
// Forget Password -- 3. Reset password, after matching the 'new password' & 'confirm password'.
userRoute.route("/forgotPasswordReset").post(async(req,res)=>{
  var {email, resetSecret, password, password2} = req.body;
  User.findOneAndUpdate({email: email, resetSecret: resetSecret}, {$set: {resetSecret: ""}}, {$unset: {resetSecret: 1}}, (err,data)=>{
    if(err) return res.status(500).send({message: 'Email doesnt exists'});
    else {
      if(password.length < 6) return res.status(400).json({ message : 'Password should be strong'});
      if(password !== password2) return res.status(500).send({message: 'New password not matching'});
      res.status(200).send({message: 'Password Reset Successful'});
    }
  })
})



const generateUrlOtp = (password) => {
  let otpRaw = bcrypt.hashSync(password, 13);
  let otpRaw2;
  let otpRaw3;
  let otp;

  if(otpRaw.includes("/")) otpRaw2 = otpRaw.replaceAll("/",'');
  else otpRaw2 = otpRaw;
  if(otpRaw2.includes("\\")) otp = otpRaw2.replaceAll("\\",'');
  else otpRaw3 = otpRaw2;
  if(otpRaw3.includes("$")) otp = otpRaw3.replaceAll("$",'');
  else otp = otpRaw3;
  return otp;
}

userRoute.route("/register").post(async(req, res, next)=> {
  var { username, email, password } = req.body;
  // res.status(200).send({
  //   username, email, password
  // })

  try {
  User.findOne({ email : email}, (err,data) => {
      if(err) return res.status(200).send({message: 'Email already exists'});
  });
  if(password.length < 6) {
    return res.status(400).json({ message : 'Password should be strong'})
  }
  
    let otp = generateUrlOtp(password);
    let pw = bcrypt.hashSync(password, 8);

    await User.create({
      username : username,
      email : email,
      verifySecret : otp,
      verifyStatus : false,
      resetSecret : '',
      password : pw
    })
    .then(user => {
      sendEmail(email,'register','User Created successfully',user,otp,res);
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
        if(err) return res.status(500).send({ message : err});
        // if(!user) return res.status(500).send({ message : `User not found with email '${email}'` });
        User.findOneAndUpdate({ verifySecret: verifySecret, verifyStatus: false}, {$set: {verifyStatus: true, verifySecret: ""}}, {$unset: {verifySecret: 1}}) .exec(async (verifyErr, verifyData) => {
          if(verifyErr) return res.status(500).send(err);
          if(!verifyData) return res.status(500).send({ message: `User verified already`});
          else res.status(200).send({ message: `User verified successfully` });
        });
    });
  } catch (err) {
    console.log("Verify Emal Error >>> ")
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