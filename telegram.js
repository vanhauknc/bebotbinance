const TelegramBot = require('node-telegram-bot-api');
const delay = require('delay');
const moment = require('moment');
const ccxt = require('ccxt');
const binance = new ccxt.binance();

// replace the value below with the Telegram token you receive from @BotFather
const token = '2088107774:AAGDODGmGia8TxwZHaeWfyu6LGXK1JOPYRQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });


bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendMessage(msg.chat.id, "Start ne");
  });


let CountFlag = 0;
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId)
    bot.sendMessage(chatId,"ken dep trai");
    // CountFlag += 1;
    // // send a message to the chat acknowledging receipt of their message
    // if(CountFlag > 0)
    // {   console.log
    //     sendMessageSync(chatId);
    // }



});
const testSend = ()=>{
    bot.sendMessage('1118912333',"chu pe dan");
}
testSend();

const sendMessageSync = async (chatId) => {

    const prices = await binance.fetchOHLCV('BNB/USDT','1m',undefined,1);
        const bPrice = prices.map(price =>{
            return {
                timestamp : moment(price[0]).format(),
                open : price[1],
                hight : price[2],
                low : price[3],
                close : price[4],
                volume : price[5]
            }
        });
        console.log({bPrice})
        bot.sendMessage(chatId, bPrice[0].close);

    // for (let i = 0; i < 10; i++) {
    //     const prices = await binance.fetchOHLCV('BNB/USDT','15m',undefined,3);
    //     const bPrice = prices.map(price =>{
    //         return {
    //             timestamp : moment(price[0]).format(),
    //             open : price[1],
    //             hight : price[2],
    //             low : price[3],
    //             close : price[4],
    //             volume : price[5]
    //         }
    //     });
    //     bot.sendMessage(chatId, bPrice);
    //     await delay(1000);
    // }

}
