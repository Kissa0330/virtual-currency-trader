import config from "./config.js";
import ccxt from "ccxt";

const bitflyer = new ccxt.bitflyer(config);
const orderSize = 0.001; //約2300円
let record = [];
let order = null;

const sleep = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

async function getData(bitflyer) {
  const ticker = await bitflyer.fetchTicker("FX_BTC_JPY");
  record.push(ticker.last);
  while (record.length > 10) record.shift();
  return record;
}

async function tradeBitcoin(bitflyer, order, record) {
  if (order) {
    if (isSell(record)) {
      order = await bitflyer.createMarketSellOrder("FX_BTC_JPY", orderSize);
      console.log("sell order:" + order);
      return null;
    } else if (isLosscut(record)) {
      order = await bitflyer.createMarketSellOrder("FX_BTC_JPY", orderSize);
      console.log("loss cut order:" + order);
      return null;
    }
  } else {
    if (isBuy(record)) {
      order = await bitflyer.createMarketBuyOrder("FX_BTC_JPY", orderSize);
      console.log("buy order:" + order);
      return order;
    }
  }
  return null;
}

function isSell(record) {
  let cnt = 0;

  for (let i = 0; i < record.length - 1; i++) {
    if (record[i] < record[i + 1]) cnt++;
  }
  if (cnt >= 6) return true;
  else return false;
}

function isLosscut(record) {
  let cnt = 0;

  for (let i = 0; i < record.length - 1; i++) {
    if (record[i] > record[i + 1]) cnt++;
  }
  if (cnt >= 8) return true;
  else return false;
}

function isBuy(record) {
  let cnt = 0;

  for (let i = 0; i < record.length - 1; i++) {
    if (record[i] > record[i + 1]) cnt++;
  }
  if (cnt >= 6) return true;
  else return false;
}
while (1) {
  record = await getData(bitflyer, record);
  if (record.length == 10) {
    console.log("record:" + record[9]);
    order = await tradeBitcoin(bitflyer, order, record);
    console.log("order:" + order);
    await sleep(10000);
  }
}
