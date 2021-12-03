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
            return res.json({
                status: false,
                message: "Tài khoản không tồn tại !"
            })
        }
        const flagCheckPass = bcrypt.compareSync(data.password, user.password);
        if (!flagCheckPass) {
            return res.json({
                status: false,
                message: "Mật khẩu không đúng !"
            })
        }
        let payload = { _id, name,email } = user;
        var token = jwt.sign({ payload }, process.env.KEY_PASSWORD, { expiresIn: '1h' });
        return res.json({
            status: true,
            message : "Đăng nhập thành công",
            data : {
                _id : user.id,
                name : user.name,
                email : user.email,
                token: token
            }
            
        })
    })
    app.post('/api/changepass',verifyToken,async (req,res)=>{
        const {password,newpassword,repassword} = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.json({
                status:false,
                message : 'Error Params'
            })
         }
        if(newpassword != repassword)
        {
            return res.json({
                status: false,
                message : "Mật khẩu xác thực không chính xác",
                data:''
            })
        }
        if(bcrypt.compareSync(password,req.user.password))
        {
            const hashPass = bcrypt.hashSync(newpassword, salt)
            let rs = await User.findByIdAndUpdate(req.user._id,{password : hashPass})
            return res.json({
                status : true,
                message : "Đổi mật khẩu thành công",
                data : ""
            })
        }else{
            //sai pass
            return res.json({
                status : false,
                message : "Mật khẩu cũ không chính xác",
                data : ""
            })
        }
    })

}