var User = require('../models/Users')
var jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const verifyToken = require('../../middleware/verifyToken')



module.exports = function (app) {

    app.get("/api/user/me",verifyToken, async (req, res) => {
        try {
            let result = null;
            result = await User.findById(req.user._id)
            res.json({
                status: true,
                message: "",
                data: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                }
            })
        } catch (ex) {
            res.json({
                status: false,
                message: ex
            })
        }

    })

    app.post("/api/register", async (req, res) => {
           const data = req.body;

            let dataUser = await User.findOne({email:data.email});

            if(dataUser)
            {
                return res.json({
                    status : false,
                    message : "Email đã được đăng ký"
                })
            }

            const hash = bcrypt.hashSync(data.password, salt);
            let data2send = {
                name: data.name,
                email: data.email,
                password: hash
            }
            let result = await User.create(data2send);
            res.json({
                status: true,
                message: "Tạo mới tài khoản thành công",
            })
        
    })
    app.post("/api/login", async (req, res) => {
        const data = req.body;

        let user = await User.findOne({ email: data.email });
        if (!user) {
            res.json({
                status: false,
                message: "Tài khoản không tồn tại !"
            })
        }
        const flagCheckPass = bcrypt.compareSync(data.password, user.password);
        if (!flagCheckPass) {
            res.json({
                status: false,
                message: "Mật khẩu không đúng !"
            })
        }
        let payload = { _id, name,email } = user;
        var token = jwt.sign({ payload }, process.env.KEY_PASSWORD, { expiresIn: '1h' });
        res.json({
            status: true,
            message : "Đăng nhập thành công",
            token: token
        })
    })

}