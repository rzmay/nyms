import clsx from 'clsx';
import relations from 'lib/constants/relations';
import dayjs from 'lib/dayjs';
import React from 'react';

function getScoreText(chain, puzzle) {
  if (chain.length < puzzle.par) return 'Niiiiice';
  if (chain.length === puzzle.par) return 'Par!';
  if (chain.length < puzzle.par * 2) return 'Good Job!';
  return 'Better Luck Next Time';
}

function getParText(chain, puzzle) {
  if (chain.length < puzzle.par) return `${puzzle.par - chain.length} Under Par`;
  if (chain.length === puzzle.par) return '';
  return `${chain.length - puzzle.par} Over Par`;
}

export default function Victory({ puzzle, chain }) {
  const score = chain.length;
  const rhymesUsed = React.useMemo(() => chain.filter(({ relation }) => relation === 'rhyme').length, [chain]);
  const emojis = React.useMemo(() => chain.map(({ relation }) => relations[relation].emoji).join(''), [chain]);
  const [copied, setCopied] = React.useState(false);

  const onShare = React.useCallback(() => {
    const shareText = `Nyms ${puzzle.number} ${dayjs(puzzle.date).format('M/D/YYYY')}

${emojis}

Try to beat my score!
        `;
    const url = 'https://nyms.rzmay.com/';

    if (navigator.share) {
      navigator.share({
        title: shareText,
        url,
      });
    } else {
      return navigator.clipboard.writeText(`${shareText}\n${url}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 5000);
        });
    }
  }, [emojis, puzzle.date, puzzle.number]);

  if (chain[chain.length - 1].word !== puzzle.end) return '';

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full grid place-content-center text-center z-20 bg-white bg-opacity-50 animate-fade">
        <div className="drop-shadow-md text-black text-5xl mb-5 font-karnak">
          {getScoreText(chain, puzzle)}
        </div>
        <div className="drop-shadow-md text-gray-800 text-3xl font-franklin mb-5">{getParText(chain, puzzle)}</div>
        <div className="drop-shadow-md text-gray-800 text-3xl mb-24">{emojis}</div>
        <div className="drop-shadow-md text-gray-800 text-3xl font-karnak mb-5">
          Score: {score}
        </div>
        <div className="drop-shadow-md text-rhyme text-3xl font-karnak mb-5">
          Used {rhymesUsed} rhymes
        </div>
        <button
          type="button"
          className="font-franklin bg-black px-5 py-2 shadow-md transition text-xl text-white hover:text-gray-400 font-sans rounded-full"
          onClick={onShare}
        >
          Share your Results
        </button>
      </div>
      <div className="fixed top-10 left-0 right-0 flex justify-center z-50">
        <div className={clsx(
          'bg-black font-franklin text-white rounded-md px-5 py-2 text-center text-lg transition-opacity duration-500 ease-in-out',
          {
            'opacity-100': copied,
            'opacity-0': !copied,
          },
        )}
        >
          Copied to Clipboard
        </div>
      </div>
    </>
  );
}
