const sheets = require('./sheets');

const RANGE = 'Sheet1!A:D';

module.exports.getPuzzle = async function getPuzzle() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: RANGE,
  });
  const rows = response.data.values;

  const currentPuzzle = rows[rows.length - 1];
  if (!currentPuzzle) return null;

  return {
    date: currentPuzzle[0],
    start: currentPuzzle[1],
    end: currentPuzzle[2],
    par: Number(currentPuzzle[3]),
    number: rows.length - 1,
  };
};

module.exports.writePuzzle = async function writePuzzle(puzzle) {
  return sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[puzzle.date, puzzle.start, puzzle.end, puzzle.par].map((v) => v.toString())],
    },
  }).then((response) => response.data);
};
