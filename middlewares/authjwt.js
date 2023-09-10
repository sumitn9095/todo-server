var jwt = require("jsonwebtoken");
require('dotenv').config();

verify = (req, res, next) =>{
  // res.status(200).send({
  //   hdr : req.
  // })
  // return;
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader.split(" ")[1];
  if(!token) res.status(403).send({ message : 'No Token provided'});
    // res.status(200).send({
    //   token: token
    // })
    // return;
  jwt.verify(token, process.env.API_SECRET, {expiresIn: "1h"}, (err, decoded) => {
    if(err) return res.status(401).send({ message : "Unauthorized"});
      // res.status(200).send({
      //   decoded
      // })
      ///return;
      req.userId = decoded.id;
      next();
  })
}

const authJwt = { verify }
module.exports = authJwt;
