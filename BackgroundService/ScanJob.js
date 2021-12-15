var Order = require('../api/models/Order');
var mongoose = require("mongoose")
var config = require("../config/index")
var GetCurrentPriceService = require('../Service/GetCurrentPriceService')
const TelegramBot = require('node-telegram-bot-api');
const delay = require('delay');
var OrderLog = require('../api/models/OrderLog');
const TelegramModel = require('../api/models/Telegram')

mongoose.connect(config.getDBConnectionString());



const sendMess = async (order) => {
    const telegramInfo = await TelegramModel.findOne({user_id:order.data.user_id});
    if(!telegramInfo){
        return;
    }
    const bot = new TelegramBot(telegramInfo.token, { polling: false });
    //1118912333
    bot.sendMessage(telegramInfo.chat_id, order.message);
    OrderLog.create({ user_id: order.data.user_id, log: order.message }, (err, rs) => {
        if (err) {
            console.log(err)
        } else {
            console.log("log :", order.message)
        }
    });

}

async function RunWhile() {
   // console.log("Run While")
    const listOrder = await Order.find({ status: 'A' });
    // var listOrder = [];
    if(listOrder.length == 0)
    {
        return
    }
    if (listOrder.length > 10) {

        let ArrayTemp = [];

        for (let i = 0; i < listOrder.length; i++) {
            let funcToPromise = new Promise((resolve, reject) => {
                GetCurrentPriceService.main(listOrder[i]._id).then(result => {
                    resolve(result);
                })
            })
            ArrayTemp.push(funcToPromise);
        }
        var i, j, temporary, chunk = 10;
        for (i = 0, j = ArrayTemp.length; i < j; i += chunk) {
            temporary = ArrayTemp.slice(i, i + chunk);
            let results = await Promise.all(temporary);

            results.forEach(result => {
                if (result.status) {
                    // Xu ly cat o day 1118912333
                    // thong bao qua telegram -615110083
                    sendMess(result);
                    const { data } = result;
                    if (data.p_status == '1') {
                        // cat 1 lan 
                        // update lai status
                        Order.findOneAndUpdate({ _id: data._id }, { status: 'D' }, (err, rs) => {
                            if (err) {
                                console.log("err", err)
                                return
                            }

                        })
                    }
                }
            })

        }


    } else {

        let ArrayTemp = [];
        for (let i = 0; i < listOrder.length; i++) {

            let funcToPromise = new Promise((resolve, reject) => {
                GetCurrentPriceService.main(listOrder[i]._id).then(result => {
                    resolve(result);
                })
            })
            ArrayTemp.push(funcToPromise);
        }
        let results = await Promise.all(ArrayTemp);
        results.forEach(result => {
            if (result.status) {
                // Xu ly cat o day
                // thong bao qua telegram
                sendMess(result);
                const { data } = result;
                if (data.p_status == '1') {
                    // cat 1 lan 
                    // update lai status
                    Order.findOneAndUpdate({ _id: data._id }, { status: 'D' }, (err, rs) => {
                        if (err) {
                            console.log("err", err)
                            return
                        }

                    })
                }
            }
        })
    }


}

const main = async () => {
console.log("Run.........")
    while (true) {
        //user_id,id_chat,Tokenbot
        RunWhile();
        await delay(5000)
    }

}
main()

