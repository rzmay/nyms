const dayjs = require('lib/dayjs');
const { getPuzzle, writePuzzle } = require('lib/puzzles');
const { generatePuzzle } = require('lib/puzzles');

module.exports = async function puzzleHandler(retry = true) {
  const day = dayjs().startOf('day');

  console.log(`Generating puzzle for ${day.format('M/D/YYYY')}`);

  try {
    const currentPuzzle = await getPuzzle(day);
    if (dayjs(currentPuzzle?.date).isSame(day, 'day')) throw new Error(`Puzzle already exists for ${day.format('M/D/YYYY')}`);

    const puzzle = await generatePuzzle();
    await writePuzzle({
      ...puzzle,
      date: day.format('M/D/YYYY'),
    });

    console.log(`Created puzzle (${puzzle.start}) -> (${puzzle.end}) for ${day.format('M/D/YYYY')} (Par ${puzzle.par})`);
    console.log(`Triggering cache revalidate at ${process.env.API_BASE_URL}/revalidate...`);

    await fetch(`${process.env.API_BASE_URL}/revalidate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REVALIDATE_TOKEN}`,
      },
    });

    console.log('Done!');
  } catch (err) {
    console.error(err);

    // Try again in one minute
    if (retry) setTimeout(() => puzzleHandler(), 1000 * 60);
  }
};
