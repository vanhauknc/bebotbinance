var Telegram = require('../models/Telegram')
const verifyToken = require('../../middleware/verifyToken')

module.exports = function (app) {

    app.get('/api/telegram', verifyToken, async (req, res) => {
        let result = await Telegram.find({ user_id: req.user._id });
        return res.json({
            status: true,
            data: result
        })
    })

    app.post('/api/telegram', verifyToken, async (req, res) => {

        let check = await Telegram.find({token:req.body.token});
        if(check.length>0){
            return res.json({
                status:false,
                message:"Token đã tồn tại"
            })
        }
        let data = {
            user_id: req.user._id,
            token: req.body.token,
            chat_id: req.body.chat_id,
        }
        let result = await Telegram.create(data);
        return res.json({
            status: true,
            message : "Thêm mới thành công",
            data: result
        })
    })

    app.put('/api/telegram', verifyToken, async (req, res) => {

        let { _id, token, chat_id } = req.body

        let result = await Telegram.findByIdAndUpdate(_id, { token: token, chat_id: chat_id });
        return res.json({
            status : true,
            message : "Cập nhật thành công",
            data : result,
        })
    })
}