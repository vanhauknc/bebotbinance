var mongoose = require("mongoose");

var Schema = mongoose.Schema;

User =  new Schema({
    name : String,
    email : String,
    password : String

},{timestamps: true})

var Users = mongoose.model("Users",User);
module.exports = Users;