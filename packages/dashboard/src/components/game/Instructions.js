import clsx from 'clsx';
import rules from 'lib/constants/rules';
import React from 'react';
import NymsContext from '../../context/NymsContext';

export default function Instructions() {
  const { chain, puzzle } = React.useContext(NymsContext);
  const end = React.useMemo(() => puzzle?.end, [puzzle]);
  const gameOver = React.useMemo(() => chain[chain.length - 1].word === end, [chain, end]);

  const formatter = new Intl.NumberFormat('en-US', { numberingSystem: 'spellout' });

  return (
    <>
      <div className={clsx(
        { 'opacity-0': chain?.length >= 2, 'animate-fade': chain?.length < 2 },
        'transition z-10 absolute top-0 left-0 py-10 md:py-0 w-full h-full flex flex-col justify-center font-karnak text-2xl md:text-4xl text-center pointer-events-none',
      )}
      >
        <div className="drop-shadow-md text-white text-3xl md:text-5xl">Get to{' '}
          <p className="text-rhyme inline">{end}</p>
        </div>
        <div className="h-1/2 md:h-2/3" />
        <div className="drop-shadow-md text-white">by traversing{' '}
          <p className="text-syn brightness-50 dark:brightness-100 inline">synonyms</p>{' '}
          and{' '}
          <p className="text-ant inline">antonyms</p>
        </div>
        <div className="drop-shadow-md text-white">You may use a{' '}
          <p className="text-rhyme inline">rhyme</p>{' '}
          every {formatter.format(rules.rhymeInterval)} words
        </div>
      </div>
      <div className={clsx(
        { 'opacity-0': chain?.length < 2 || gameOver, 'animate-fade': chain?.length >= 2 && !gameOver },
        'transition absolute bottom-0 ml-5 mb-2 font-karnak text-4xl drop-shadow-md text-white z-50',
      )}
      >
        <div className="drop-shadow-md text-white text-3xl md:text-2xl">Get to{' '}
          <p className="text-rhyme inline">{end}</p>
        </div>
      </div>
    </>
  );
}
