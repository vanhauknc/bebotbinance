var Order = require('../models/Order')
var GetCurrentPriceService = require('./../../Service/GetCurrentPriceService')
const verifyToken = require('../../middleware/verifyToken')
const OrderLog = require('../models/OrderLog')

function getOrder(res) {
    Order.find({}).sort({ createdAt: 'desc' }).exec((err, order) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({status:true,
                data : order
            });
        }
    });
}
module.exports = function (app) {

    app.get("/api/orders",verifyToken,async (req, res) => {
        //getOrder(res);
        let results = await Order.find({user_id:req.user._id});
        res.json({
            status:true,
            data:results
        })
    });

    app.get("/api/order/:id",verifyToken, (req, res) => {
        Order.findById({ _id: req.params.id }, (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.json(result)
            }
        })
    })

    app.post("/api/order",verifyToken, async function (req, res) {
        let data = req.body;
        data.user_id = req.user._id;
        const type = await GetCurrentPriceService.checkType(data.priceflag,data.imtcode);
        data.type = type;
        Order.create(data, function (err, order) {
            if (err) {
                throw err;
            } else {
                res.json({
                    status : true,
                    data : order
                })
            }
        })
    })

    app.put("/api/order",verifyToken, async (req, res) => {
        if (!req.body.id) {
            return res.status(500).json({
                status: false,
                message: "ID id required"
            })
        } else {
            const data = req.body;
            try {
                await Order.findOneAndUpdate({ _id: req.body.id }, data);
                let dataOrder = await Order.findById(req.body.id);
                res.send({
                    status: true,
                    data: dataOrder
                })
            } catch (ex) {
                res.send({
                    status: false,
                    message: ex
                })
            }
        }
    })

    app.delete("/api/order/:id",verifyToken, async (req, res) => {
        if (!req.params.id) {
            return res.status(500).send("ID is required")
        } else {
            try {
                const data = req.body;
                let result = await Order.deleteOne({ _id: req.params.id }, data);
                res.send({
                    status: true,
                    data: {
                        id : req.params.id
                    }
                })
            } catch (ex) {
                res.send({
                    status: false,
                    message: ex
                })
            }

        }
    })

    app.get("/api/orderhistory",verifyToken,async (req,res)=>{
        const OrderLogs = await OrderLog.find({user_id:req.user._id}).sort({createdAt:'desc'});
        res.send({
            status:true,
            data:OrderLogs
        })
    } )

    app.get("/api/test",async(req,res)=>{
        let type = await GetCurrentPriceService.checkType('500','BNB/USDT')
        res.send(type)
    })

}