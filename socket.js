const delay = require('delay');
const express = require('express');
const app = express();
const http = require('http');
const { random } = require('lodash');
const server = http.createServer(app);
const { Server } = require("socket.io");
const ccxt = require('ccxt');
var _ = require('lodash');
const io = new Server(server);
require('dotenv').config();

const binance = new ccxt.binance();

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});
app.get('/', (req, res) => {
  res.json("Socket Service")
});

io.on('connection', async (socket) => {
  console.log('a user connected');
});

server.listen(process.env.PORT_SOCKET || 5555, () => {
  console.log('listening on *: ' + process.env.PORT_SOCKET);
});


async function getListCoinValues() {
  console.log("Start getListCoinValues")
  while (true) {
    const fetchAll = await binance.fetchTickers();
    let obj = Object.values(fetchAll)
    let tempArray = [];
    obj.map(data => {
      if (data.symbol.substr(data.symbol.length - 4, 4) == 'USDT') {
        tempArray.push(data)
      }
    })


    let ArrayReturn = [];
    let ArraySort = [];
    ArraySort = _.orderBy(tempArray, ['quoteVolume'], ['desc']);

    for (let i = 0; i < 56; i++) {
      let objTemp = {
        symbol: ArraySort[i].symbol,
        percentage: ArraySort[i].percentage,
        close: ArraySort[i].close
      }
      ArrayReturn.push(objTemp);
    }
    io.emit('get-data',ArrayReturn)
    await delay(1000);

  }
}
getListCoinValues();
