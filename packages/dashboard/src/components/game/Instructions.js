import clsx from 'clsx';
import rules from 'lib/constants/rules';
import React from 'react';

export default function Instructions({ end, className }) {
  const formatter = new Intl.NumberFormat('en-US', { numberingSystem: 'spellout' });

  return (
    <div className={clsx(
      className,
      'absolute top-0 left-0 py-10 md:py-0 w-full h-full flex flex-col justify-center font-karnak text-2xl md:text-4xl text-center pointer-events-none',
    )}
    >
      <div className="drop-shadow-md text-white text-3xl md:text-5xl">Get to{' '}
        <p className="text-rhyme inline">{end}</p>
      </div>
      <div className="h-1/2 md:h-2/3" />
      <div className="drop-shadow-md text-white">by traversing{' '}
        <p className="text-syn inline">synonyms</p>{' '}
        and{' '}
        <p className="text-ant inline">antonyms</p>
      </div>
      <div className="drop-shadow-md text-white">You may use a{' '}
        <p className="text-rhyme inline">rhyme</p>{' '}
        every {formatter.format(rules.rhymeInterval)} words
      </div>
    </div>
  );
}
