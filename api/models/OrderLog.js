var mongoose = require("mongoose");

var Schema = mongoose.Schema;

OrderLog =  new Schema({
    user_id : String,
    log : String,

},{timestamps: true})

var Order = mongoose.model("orderLogs",OrderLog);
module.exports = Order;