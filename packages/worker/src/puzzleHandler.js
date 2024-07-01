const dayjs = require('lib/dayjs');
const { getPuzzle, writePuzzle } = require('lib/puzzles');
const { generatePuzzle } = require('lib/words');

module.exports = async function puzzleHandler() {
  const day = dayjs().startOf('day');

  console.log(`Generating puzzle for ${day.format('M/D/YYYY')}`);

  try {
    const currentPuzzle = await getPuzzle();
    if (dayjs(currentPuzzle?.date) === day) throw new Error(`Puzzle already exists for ${day.format('M/D/YYYY')}`);

    await writePuzzle({
      ...(await generatePuzzle()),
      date: day.format('M/D/YYYY'),
    });
  } catch (err) {
    console.error(err);

    // Try again in one minute
    setTimeout(() => puzzleHandler(), 1000 * 60);
  }
};
