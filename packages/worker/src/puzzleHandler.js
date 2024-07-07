const dayjs = require('lib/dayjs');
const { getPuzzle, writePuzzle } = require('lib/puzzles');
const { generatePuzzle } = require('lib/words');

module.exports = async function puzzleHandler(retry = true) {
  const day = dayjs().startOf('day');

  console.log(`Generating puzzle for ${day.format('M/D/YYYY')}`);

  try {
    const currentPuzzle = await getPuzzle();
    if (dayjs(currentPuzzle?.date).isSame(day, 'day')) throw new Error(`Puzzle already exists for ${day.format('M/D/YYYY')}`);

    const puzzle = await generatePuzzle();
    await writePuzzle({
      ...puzzle,
      date: day.format('M/D/YYYY'),
    });

    console.log(`Created puzzle (${puzzle.start}) -> (${puzzle.end}) for ${day.format('M/D/YYYY')} (Par ${puzzle.par})`);
  } catch (err) {
    console.error(err);

    // Try again in one minute
    if (retry) setTimeout(() => puzzleHandler(), 1000 * 60);
  }
};
