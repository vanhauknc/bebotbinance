const ccxt = require('ccxt');
const binance = new ccxt.binance();



module.exports = {

    getAllIMT : async function (){
        let makets = await binance.loadMarkets();
    
        let ArrayTemp = [];
        binance.symbols.forEach((data,index)=>{
            let tmp = data.split("/")[1];
            if(tmp == 'USDT')
            {
                ArrayTemp.push(data);
            }
        })
        return ArrayTemp;
    
    }
}