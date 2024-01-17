const express = require("express");
let Hobby = require("../models/hobby");
let User = require("../models/users");

getUser = async(req, res, next) => {
    //console.log("ijui --- ", req);
   // try {
        return User.findOne({ email : req }).exec();
        ///console.log("getUser ------ 111", req.body, res.body);
       /// return res.status(200).send({ sw: req });
        //next();
    // } catch {
    //     //console.log("getUser ------ 000", req.body, res.body);
    //     return res.status(500).send({ message: "Some Error Occured" })
    // }
};

hobbyremove = (req, res, next) => {
    console.log("console.params", req.body.id);
    Hobby.findByIdAndRemove(req.body.id, (err, data)=>{
        if(err) res.status(500).send({ err });
        res.send({ message : "Successfully removed", data})
    })
    //res.send({ message : "Successfully removed"})
}

fetchAll = async(req, res, next) => {
   // try {
        const grt = await getUser(req.body.email);
        // console.log("444---grt", grt);
        // grt.then(usr => {
        //     console.log("444", usr);
        // });
    // } catch {
    //     console.log("111", res.error);
    // }

    Hobby.find({ email : grt.email }, (err, hobbies) => {
        if(err) return res.status(400).send({ err });
        res.status(200).send({ data : hobbies });
    })


    //Hobby.findOne({ email : req.body.email }, (err, hobby) => {
       // try {
          //  let isUserValid = await getUser(req);
           // console.log("Is User Valid", req.body, res.body);
        // } catch {
        //     return res.status(500).send({ err : Error, message: "Some Error Occured" })
        // }
        

        //if(err) res.status(400).send({ err })
        //Task.find((err, data)=>{
        //    if(err) return res.status(400).send({ message : 'No User Tasks found'});
        //    return res.status(200).json({ hobby });
        //})
   // })
  // return res.status(200).send({ sw: req });
}

add = async (req, res, next) => {
    const { email, name, priority} = req.body;
    const grt = await getUser(email);
    //console.log("add hobby ->>", grt);
    try {
        Hobby.create({
            name: name,
            priority : priority,
            email: grt.email
        })
        res.status(200).send({ hobby: {name, priority}, message: "Created hobby"});
    } catch {
        res.status(500).send({ Error })
    }

    // try {
    //     await User.find({  email : email }).then(user => {
    //         try {
    //             Hobby.create({
    //                 name: name,
    //                 priority : priority,
    //                 user: user._id
    //             })
    //         } catch {
                
    //         }
    //     });
    //     res.status(200).send({ hobby: {name, priority}, message: "Created hobby"});
    // } catch {
    //     res.status(500).send({ Error })
    // }
}



module.exports = { getUser, fetchAll, add, hobbyremove };