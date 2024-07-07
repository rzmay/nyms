const cron = require('node-cron');
const puzzleHandler = require('./src/puzzleHandler');

async function start() {
  // Always try on startup in case of missed cron
  puzzleHandler(false);

  // Schedule puzzle generation
  cron.schedule('0 0 * * *', puzzleHandler);
}

start();
