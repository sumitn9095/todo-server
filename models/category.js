const mongoose = require('mongoose');
const schema = mongoose.Schema;

let Category = new schema(
    {
        name: {
            type: String,
            unique: true,
        }
    },
    {
        collection: "category"
    }
)


module.exports = mongoose.model("Category",Category);