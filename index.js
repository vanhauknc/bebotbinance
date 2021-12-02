const ccxt = require('ccxt');
const moment = require('moment');
var _ = require('lodash');

// {
//     apiKey : 'monkvdLtE8B8qXTBKGPuJAv6pjabn6pTOTFOpHIzE5koOA7PNdEHt4r8mYFvsn1N',
//     secret:'sv4V2QFIgrPU5arUnsQRPwqqetcXvBSKPuyWX23IuLWrc6YdC7c3LmgVLCiFlupl'
// }
const binance = new ccxt.binance();

//binance.setSandboxMode(true);

async function getBalance() {
    const balance = await binance.fetchBalance();
    console.log(balance);
}

async function main() {

    const prices = await binance.fetchOHLCV('BNB/USDT', '15m', undefined, 20);

    const bPrice = prices.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1],
            hight: price[2],
            low: price[3],
            close: price[4],
            volume: price[5]
        }
    });

    const averagePrice = bPrice.reduce((acc, price) => acc + price.close, 0) / 20;
    const lastPrice = bPrice[bPrice.length - 1].close;

    let perCent = 100 - (averagePrice / lastPrice * 100);
    perCent = perCent.toFixed(3);
    /// mua khi percent âm percent
    const StandardDeviation = 2 * getStandardDeviation(bPrice);

    let Upper = averagePrice + StandardDeviation;
    let Below = averagePrice - StandardDeviation;

    Upper = Upper.toFixed(3);
    Below = Below.toFixed(3);

    const ORDER_TYPE = perCent >= 0 ? "BUY" : "SELL";

    const MAX_TRADE = 10; //10$

    // lay record tu database
    // neu ton tai record thi tim kiem lenh ban hoac - % >=5 de x2 
    // nguoc lai thi tim kiem lenh mua

    if (perCent <= - 1) {
        //buy
        const QTY = MAX_TRADE / Below;
        // luu vao database
    }
    if (perCent >= 1) {
        //sell
        const QTY2 = MAX_TRADE / Upper;

    }


    console.log("gia trung binh", averagePrice)

    console.log("gia hien tai", lastPrice)

    console.log("%", perCent)

    console.log("tran", Upper)
    console.log("san", Below)




}

function getStandardDeviation(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b.close, 0) / n;
    return Math.sqrt(array.map(x => Math.pow(x.close - mean, 2)).reduce((a, b) => a + b, 0) / n);
}

async function test() {
    const fetchAll = await binance.fetchTickers();
    let obj = Object.values(fetchAll)
    let tempArray = [];
    obj.map(data => {
        if (data.symbol.substr(data.symbol.length - 4, 4) == 'USDT') {
            tempArray.push(data)
        }
    })


    let ArraySort = [];
    ArraySort = _.orderBy(tempArray, ['quoteVolume'], ['desc']);

    for (let i = 0; i < 30; i++) {
        let objTemp = {
            symbol: ArraySort[i].symbol,
            percentage: ArraySort[i].percentage,
            close: ArraySort[i].close
        }
        console.log(objTemp)
    }

}
test();