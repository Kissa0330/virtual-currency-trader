import config from "./config.js";
import ccxt from "ccxt";

const bitflyer = new ccxt.bitflyer(config);
let record = [];

await getData(bitflyer);
tradeBitcoin();
await sleep(10000);

const sleep = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

async function getData(bitflyer) {
  const ticker = await bitflyer.fetchTicker("FX_BTC_JPY");
  record.push(ticker);
  while (record.length > 10) record.shift();
}

function tradeBitcoin() {
}
