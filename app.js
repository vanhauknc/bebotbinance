var express = require('express')
var bodyParser = require("body-parser");
var morgan = require('morgan');
var config = require("./config/index")
var mongoose = require("mongoose")
require('dotenv').config();


var orderController =  require('./api/controllers/orderController');
const imtController = require('./api/controllers/imtController');
const UserController = require('./api/controllers/UserController')
const verifyToken = require('./middleware/verifyToken')

var app = express();
var port = process.env.PORT || 3000;
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use("/assets/",express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("dev"));

mongoose.connect(config.getDBConnectionString());


orderController(app);
imtController(app);
UserController(app);


app.get("/",verifyToken,function(req,res){
    res.json(
    {
        status:"OK",
        message:"this is binance bot"
    })
})
app.listen(port,function(){
   
    console.log("App listening on port : "+port);
})