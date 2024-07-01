const cron = require('node-cron');
const puzzleHandler = require('./src/puzzleHandler');

async function start() {
  // Schedule puzzle generation
  cron.schedule('0 0 * * *', puzzleHandler);
}

start();
