/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const axios = require('axios');
const relations = require('lib/constants/relations');
const sample = require('lodash/sample');
const rules = require('./constants/rules');

const datamuse = axios.create({
  baseURL: 'https://api.datamuse.com',
});

module.exports.fetchRelatedWords = async function fetchRelatedWords(word, relationshipType) {
  const response = await datamuse.get('/words', {
    params: {
      [relations[relationshipType].code]: word,
      max: rules.maxRelated, // Can't have too many
    },
  });

  return response.data.map((entry) => entry.word).filter((word) => /^(?!.*[\s-])[a-zA-Z]{3,}$/.test(word.trim()));
};

module.exports.getRelatedWords = async function getRelatedWords(word, allowRhymes = false) {
  const relatedWords = [];

  const synonyms = await module.exports.fetchRelatedWords(word, 'synonym');
  relatedWords.push(...synonyms.map((synonym) => ({ word: synonym, relation: 'synonym' })));

  const antonyms = await module.exports.fetchRelatedWords(word, 'antonym');
  relatedWords.push(...antonyms.map((antonym) => ({ word: antonym, relation: 'antonym' })));

  if (allowRhymes) {
    const rhymes = await module.exports.fetchRelatedWords(word, 'rhyme');
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
