let Category = require("../models/category");

fetchAll = (req, res, next) => {
    const { email } = req.body;
    Category.find({ email : email}, (err, data) => {
        if(err) return res.status(500).send({ err, message: 'Error in fetching categories'});
        return res.status(200).send({ data });
    });
}

add = (req, res, next) => {
    const { email, name } = req.body;
    Category.create({email, name}, (err, data)=>{
        if(err) return res.status(500).send({ err, message: 'Error in creating categories'});
        return res.status(200).send({ data });
    })
}

remove = (req, res, next) => {
    Category.findByIdAndRemove(req.body.id, (err, data)=>{
        if(err) res.status(500).send({ err });
        res.send({ message : "Successfully removed", data})
    })
}

module.exports = { fetchAll, add, remove };