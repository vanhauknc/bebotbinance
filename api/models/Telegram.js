var mongoose = require("mongoose");

var Schema = mongoose.Schema;

Telegram =  new Schema({
    user_id : String,
    token : String,
    chat_id : String

},{timestamps: true})

var Telegrams = mongoose.model("Telegrams",Telegram);
module.exports = Telegrams;