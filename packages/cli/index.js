/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const inquirer = require('inquirer');
const relations = require('lib/constants/relations');
const rules = require('lib/constants/rules');
const { getRelatedWords, generatePuzzle } = require('lib/words');

async function main() {
  console.log('Starting');

  // Setup
  const { start: startWord, end: endWord, par } = await generatePuzzle({ minIters: 5, maxIters: 10 });

  // Interface
  const chain = [{ word: startWord, relation: null }];
  console.log(`STARTING WORD: ${startWord}`);
  console.log(`TARGET WORD: ${endWord}`);
  console.log(`PAR: ${par}`);
  let currWord = chain[0];
  while (currWord.word !== endWord) {
    console.log(`Word: ${currWord.word}`);

    const wordsSinceRhyme = (chain.length - 1) - chain.findLastIndex(({ relation }) => relation === 'rhyme');
    const relatedWords = (await getRelatedWords(currWord.word, wordsSinceRhyme >= rules.rhymeInterval))
      .filter(({ word }) => !chain.find(({ word: chainWord }) => chainWord === word));

    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'word',
      message: 'Select a word:',
      choices: [
        ...relatedWords.map((word) => ({
          name: chalk.hex(relations[word.relation].hex)(word.word),
          value: word,
        })),
        ...(chain.length > 1 ? [{ name: chalk.magenta('BACK'), value: 'back' }] : []),
      ],
      pageSize: 20,
    }]);

    if (answers.word === 'back') {
      chain.pop();
      currWord = chain[chain.length - 1];
      continue;
    }

    chain.push(answers.word);
    currWord = answers.word;
  }

  console.log('Congrats!');
  console.log(`Your score: ${chain.length}`);
  console.log(`Rhymes used: ${chain.filter(({ relation }) => relation === 'rhyme').length}`);
  console.log(chain.map(({ relation }) => relations[relation].emoji).join(''));
}

main();
