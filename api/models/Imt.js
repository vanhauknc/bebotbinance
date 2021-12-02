var mongoose = require("mongoose");

var Schema = mongoose.Schema;

imtSchema =  new Schema({
    imtcode : String,

},{timestamps: true})

var Imt = mongoose.model("Imts",imtSchema);
module.exports = Imt;