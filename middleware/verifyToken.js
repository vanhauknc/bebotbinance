var jwt = require('jsonwebtoken');

var verifyToken = (req,res,next)=>{
    if(!req.headers['authorization']){
        return res.json({
            status:false,
            message : 'Token Error'
        })
    } 
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1];
    jwt.verify(token,process.env.KEY_PASSWORD,(err,payload)=>{
        if(err){
            return res.json({
                status:false,
                message:"Token Wrong"
            })
        }

        req.user = payload.payload;
        next();
    })

}
module.exports = verifyToken;