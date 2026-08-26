/*
  * Alternatively to running a worker, we can run a cron task instead.
  * The worker is really just a cron job anyway, so this method
  * allows us to save money on services like Render to just
  * call the job recurrently rather than having a live worker
  * doing nothing 24/7.
*/

const puzzleHandler = require('./src/puzzleHandler');

async function start() {
  // Always try on startup in case of missed cron
  puzzleHandler(false);
}

start();
