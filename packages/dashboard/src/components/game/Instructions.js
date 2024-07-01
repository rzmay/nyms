import clsx from 'clsx';
import React from 'react';

export default function Instructions({ end, className }) {
  return (
    <div className={clsx(
      className,
      'absolute top-0 left-0 w-full h-full grid place-content-center font-karnak text-4xl text-center pointer-events-none',
    )}
    >
      <div className="drop-shadow-md text-white text-5xl">Get to{' '}
        <p className="text-rhyme inline">{end}</p>
      </div>
      <div className="h-96" />
      <div className="drop-shadow-md text-white">by traversing{' '}
        <p className="text-syn inline">synonyms</p>{' '}
        and{' '}
        <p className="text-ant inline">antonyms</p>
      </div>
      <div className="drop-shadow-md text-white">You may use a{' '}
        <p className="text-rhyme inline">rhyme</p>{' '}
        every four words
      </div>
    </div>
  );
}
