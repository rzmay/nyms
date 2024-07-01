import { getRelatedWords } from 'lib/words';
// import sample from 'lodash/sample';
// import sampleSize from 'lodash/sampleSize';
import React from 'react';

export default function useRelatedWords(currentWord, chain, allowRhymes) {
  const [relatedWords, setRelatedWords] = React.useState();

  React.useEffect(() => {
    getRelatedWords(currentWord.word, allowRhymes)
      .then((response) => setRelatedWords(response
        ?.filter(({ word }) => !chain.some((e) => e.word === word))
        ?.map((rw) => ({ ...rw, prior: currentWord.word }))));
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

  return relatedWords;
}
