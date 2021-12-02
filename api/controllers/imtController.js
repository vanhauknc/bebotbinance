var Imt = require('../models/Imt')
var GetimtService = require('../../Service/GetImtService')
const verifyToken = require('../../middleware/verifyToken')

getImts = async (res) => {
    try {
        let results = null;
        results = await Imt.find({});
        res.json({
            status:true,
            data:results
        });
    } catch (ex) {
        res.status(500).send(ex);
    }


}

module.exports = function (app) {

    app.get('/api/imts',verifyToken, (req, res) => {
        getImts(res)
    })

    app.post('/api/imt',verifyToken, (req, res) => {
        let data = req.body;
        Imt.create(data, (err, result) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json({
                status: true,
                data: result
            })
        });
    })

    app.get('/api/syncimts',async (req,res)=>{
        try{
            await Imt.remove({});
            let reuslts = null;
            reuslts = await GetimtService.getAllIMT();
            let ArrayTemp = [];

            reuslts.forEach(data=>{
                let obj = {
                    imtcode : data
                }
                ArrayTemp.push(obj)
            })
           let rs = await Imt.create(ArrayTemp);
           res.json({
               status:true,
               data:rs
           }) 

        }catch(ex){
            res.status(500).send(ex)
        }
         
    })



}