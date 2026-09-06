import clsx from 'clsx';
import React from 'react';
import NymsContext from '../../context/NymsContext';
import Loading from '../common/Loading';

export default function HintButton() {
  const { canUseHint, hintsAvailable, getHint, hintLoading } = React.useContext(NymsContext);

  return (
    <button
      type="button"
      className={clsx(
        'inline bg-white ml-4 px-2 py-1 text-sm shadow-md transition text-gray-700 hover:text-gray-400 font-sans rounded-full',
        {
          'opacity-0': !canUseHint,
          'opacity-100': canUseHint,
        },
      )}
      disabled={!canUseHint || hintLoading}
      onClick={getHint}
    >
      Hint
      {hintsAvailable > 1 ? ` x${hintsAvailable}` : ''}
      {hintLoading && <Loading className="inline ml-2" size="sm" />}
    </button>
  );
}
