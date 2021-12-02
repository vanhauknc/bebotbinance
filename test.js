const ccxt = require('ccxt');
const binance = new ccxt.binance();

getAllIMT = async () =>{
    let makets = await binance.loadMarkets();
    console.log("makets",binance.symbols)
    let count =0;
    binance.symbols.forEach((data,index)=>{
        let tmp = data.split("/")[1];
        if(tmp == 'USDT')
        {
            count+=1;
            console.log(count,data);
        }
    })
  //  let symbols2 = Object.keys(binance.markets)
   // let currencies = binance.currencies 
}

getAllIMT();