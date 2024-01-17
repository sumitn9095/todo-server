var jwt = require("jsonwebtoken");
require('dotenv').config();
const { TokenExpiredError } = jwt;
const { v4, uuid } = require("uuid");
const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

verify = (req, res, next) =>{
  // res.status(200).send({
  //   hdr : req.
  // })
  // return;
  const tokenHeader = req.headers.authorization;
  // const token = tokenHeader.split(" ")[1];
  const token = tokenHeader.split(" ")[1];
  if(!token) res.status(403).send({ message : 'No Token provided'});
    // res.status(200).send({
    //   token: token
    // })
    // return;
  jwt.verify(token, process.env.API_SECRET, {expiresIn: "1h"}, (err, decoded) => {
    if(err) catchError(err, res);
      //console.log("token-decoded", err, res);
      req.userId = decoded.id;
      next();
  })
}

const authJwt = { verify }
module.exports = authJwt;
