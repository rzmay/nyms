/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const axios = require('axios');
const relations = require('lib/constants/relations');
const sample = require('lodash/sample');
const shuffle = require('lodash/shuffle');

const datamuse = axios.create({
  baseURL: 'https://api.datamuse.com',
});

async function fetchRelatedWords(word, relationshipType) {
  const response = await datamuse.get('/words', {
    params: {
      [relations[relationshipType].code]: word,
      max: 10, // Can't have too many
    },
  });

  return response.data.map((entry) => entry.word).filter((word) => !/[\s-]/.test(word.trim()));
}

module.exports.getRelatedWords = async function getRelatedWords(word, allowRhymes = false) {
  const relatedWords = [];

  const synonyms = await fetchRelatedWords(word, 'synonym');
  relatedWords.push(...synonyms.map((synonym) => ({ word: synonym, relation: 'synonym' })));

  const antonyms = await fetchRelatedWords(word, 'antonym');
  relatedWords.push(...antonyms.map((antonym) => ({ word: antonym, relation: 'antonym' })));

  if (allowRhymes) {
    const rhymes = await fetchRelatedWords(word, 'rhyme');
    relatedWords.push(...rhymes.map((rhyme) => ({ word: rhyme, relation: 'rhyme' })));
  }

  return relatedWords;
};

module.exports.getRandomWord = async function getRandomWord() {
  const randomLetter = sample('abcdefghijklmnopqrstuvwxyz'.split(''));

  const response = await datamuse.get('/words', {
    params: { sp: `${randomLetter}*`, max: 1000 },
  });

  const randomWord = sample(response.data
    .map(({ word }) => word.trim())
    .filter((word) => !/[\s-]/.test(word)));

  // Ensure it has related words
  if ((await module.exports.getRelatedWords(randomWord)).length === 0) return getRandomWord();

  return randomWord;
};

module.exports.generatePuzzle = async function generatePuzzle(iterations = 5) {
  // Get a random word to start
  const startWord = await module.exports.getRandomWord();
  const rhymesWithStart = await fetchRelatedWords(startWord, 'rhyme');
  let par = iterations;

  // Recursive random traversal
  const traversed = [startWord];
  const randomTraverse = async (word, depth) => {
    if (depth <= 0) {
      // Make sure it doesn't rhyme with start!
      if (rhymesWithStart.includes(word)) {
        par++;
        return randomTraverse(word, depth); // One extra step if it rhymes
      }
      return word;
    }

    const related = shuffle(await module.exports.getRelatedWords(word))
      .filter(({ word }) => !traversed.includes(word))
      .map(({ word }) => word);

    for (const relatedWord of related) {
      traversed.push(relatedWord);

      const solution = await randomTraverse(relatedWord, depth - 1);
      if (solution) return solution;
    }

    return null;
  };

  const endWord = await randomTraverse(startWord, iterations);

  // Try again if no solution found for this start word
  return endWord ? { start: startWord, end: endWord, par } : module.exports.generatePuzzle(iterations);
};
