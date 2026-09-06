/* eslint-disable no-await-in-loop */
const shuffle = require('lodash/shuffle');
const dayjs = require('./dayjs');
const sheets = require('./sheets');
const { fetchRelatedWords, getRelatedWords, getRandomWord } = require('./words');

const getRange = () => `'${(process.env.SHEET_NAME || 'Sheet1').replace(/'/g, "''")}'!A:E`;

module.exports.getPuzzle = async function getPuzzle(date, getPath = false) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: getRange(),
  });
  const rows = response.data.values;

  const currentPuzzle = date
    ? rows.find(([day]) => day === dayjs(date).format('M/D/YYYY')) || rows[rows.length - 1]
    : rows[rows.length - 1];

  if (!currentPuzzle) return null;

  return {
    date: currentPuzzle[0],
    start: currentPuzzle[1],
    end: currentPuzzle[2],
    par: Number(currentPuzzle[3]),
    number: rows.length - 1,
    ...(getPath && { path: currentPuzzle[4]?.split(',') }),
  };
};

module.exports.writePuzzle = async function writePuzzle(puzzle) {
  return sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: getRange(),
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[puzzle.date, puzzle.start, puzzle.end, puzzle.par, puzzle.path.join(',')].map((v) => v.toString())],
    },
  }).then((response) => response.data);
};

module.exports.generatePuzzle = async function generatePuzzle({
  minIters = 5,
  maxIters = 10,
} = {}) {
  const iterations = minIters + Math.round(Math.random() * (maxIters - minIters));

  // Get a random word to start
  const startWord = await getRandomWord();
  const par = iterations;

  // Generate a list of prohibited end words -- shouldn't rhyme with start or be <= 2 steps away
  const prohibitedWords = await fetchRelatedWords(startWord, 'rhyme');
  const initialRelated = await getRelatedWords(startWord);
  for (const { word } of initialRelated) {
    prohibitedWords.push(word, ...(await getRelatedWords(word)).map(({ word }) => word));
  }

  // Recursive random traversal
  const traversed = [startWord];
  const randomTraverse = async (word, depth, path) => {
    if (depth <= 0) {
      // Make sure it's not prohibited
      if (prohibitedWords.includes(word)) return [null, path];
      return [word, path];
    }

    const related = shuffle(await getRelatedWords(word))
      .filter(({ word }) => !traversed.includes(word))
      .map(({ word }) => word);

    for (const relatedWord of related) {
      traversed.push(relatedWord);

      const solution = await randomTraverse(relatedWord, depth - 1, path.concat(relatedWord));
      if (solution) return solution;
    }

    return [null, path];
  };

  const [endWord, path] = await randomTraverse(startWord, iterations, []);

  // Try again if no solution found for this start word
  return endWord ? { start: startWord, end: endWord, par, path } : generatePuzzle({ minIters, maxIters });
};
