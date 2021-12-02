var mongoose = require("mongoose");

var Schema = mongoose.Schema;

orderSchema =  new Schema({
    imtcode : String,
    user_id : String,
    priceflag : Number,
    type : String,
    status : String,
    p_status : String,

},{timestamps: true})

var Order = mongoose.model("orders",orderSchema);
module.exports = Order;