import { getRelatedWords } from 'lib/words';
// import sample from 'lodash/sample';
// import sampleSize from 'lodash/sampleSize';
import React from 'react';

const CACHE = {};

export default function useRelatedWords(currentWord, chain, allowRhymes) {
  const [relatedWords, setRelatedWords] = React.useState();

  React.useEffect(() => {
    setRelatedWords(CACHE[currentWord.word]);

    getRelatedWords(currentWord.word, allowRhymes)
      .then((response) => {
        CACHE[currentWord.word] = response;
        setRelatedWords(response);
      });
  }, [chain, currentWord, allowRhymes]);

  // Temporary since API is down
  // React.useEffect(() => {
  //   new Promise((resolve) => resolve(Array.from({ length: Math.round(Math.random() * 20) }).map(() => ({
  //     word: sampleSize('abcdefghijklmnopqrstuvwxyz', 5).join(''),
  //     relation: sample(['synonym', 'antonym', ...(allowRhymes ? ['rhyme'] : [])]),
  //   }))))
  //     .then((response) => setRelatedWords(response
  //       .filter(({ word }) => !chain.some((e) => e.word === word))));
  // }, [chain, currentWord, allowRhymes]);

  return relatedWords
    ?.filter(({ word }) => !chain.some((e) => e.word === word))
    ?.map((rw) => ({ ...rw, prior: currentWord.word }));
}
