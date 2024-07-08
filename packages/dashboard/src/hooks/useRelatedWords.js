import { getRelatedWords } from 'lib/words';
import React from 'react';

export default function useRelatedWords(currentWord, chain, allowRhymes) {
  const [cache, setCache] = React.useState({});

  React.useLayoutEffect(() => {
    getRelatedWords(currentWord.word, allowRhymes)
      .then((response) => {
        setCache((cache) => ({ ...cache, [currentWord.word]: response }));
      });
  }, [chain, currentWord, allowRhymes]);

  return React.useMemo(
    () => (cache[currentWord.word] || [])
      .filter(({ word }) => !chain.some((e) => e.word === word))
      .map((rw) => ({ ...rw, prior: currentWord.word })),
    [cache, chain, currentWord.word],
  );
}
