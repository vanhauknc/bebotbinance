const moment = require('moment');
const ccxt = require('ccxt');
const delay = require('delay');
const binance = new ccxt.binance();
var Order = require('../api/models/Order')

function getPrice(imtCode) {
    return new Promise((resolve, reject) => {

        binance.fetchOHLCV(imtCode, '1m', undefined, 1).then((data) => {
            let currentPrice = null;
            try {
                currentPrice = {
                    timestamp: moment(data[0][0]).format(),
                    open: data[0][1],
                    hight: data[0][2],
                    low: data[0][3],
                    close: data[0][4],
                    volume: data[0][5]
                }
                resolve(currentPrice)
            } catch (ex) {
                reject(ex)
            }
        }).catch(err => { reject(err) })

    })
}
module.exports = {

    main :async function(id)  {
        try {
                const ObjData = await Order.findById(id); 
                const priceGet = await getPrice(ObjData.imtcode);
                //dieu kien de xuat thong bao
                if (ObjData.type == 'bigger') {
                    if (priceGet.close > ObjData.priceflag) {
                        return {
                            status : true,
                            message : `${ObjData.imtcode} đã cắt qua : ${ObjData.priceflag}, giá hiện tại : ${priceGet.close}`,
                            data : ObjData
                            }
                    }
                }else{
                    if (priceGet.close < ObjData.priceflag) {
                        return {
                            status : true,
                            message : `${ObjData.imtcode} đã cắt qua : ${ObjData.priceflag}, giá hiện tại : ${priceGet.close}`,
                            data : ObjData
                            }
                    }
                }
                return {
                    status : false,
                    message : `Nothing`,
                    data : ObjData
                    }
    
        } catch (err) {
            console.log("Error", err);
        }
    
    
    },
    checkType : async function(price,imtcode){
        try{
            const priceGet = await getPrice(imtcode);

            if(price < priceGet.close)
            {
                return "less"
            }else{
                return "bigger"
            }
        }catch(err){
            console.log("Error", err);
        }
    }
}





