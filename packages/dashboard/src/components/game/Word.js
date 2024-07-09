import clsx from 'clsx';
import relations from 'lib/constants/relations';
import React from 'react';
import seedrandom from 'seedrandom';
import NymsContext from '../../context/NymsContext';
import getWordPosition from '../../helpers/getWordPosition';

export default function Word({
  word, relation = null,
}) {
  const {
    currentWord, getKey, lastWord, setLastWord, setPosition, loadingPositions, getPosition, activePositions, puzzle, center, chain, setChain, relatedWords, setHoveredWord,
  } = React.useContext(NymsContext);
  const wordRef = React.useRef(null);

  const isTarget = React.useMemo(() => word === puzzle.end, [puzzle.end, word]);
  const key = React.useMemo(() => getKey(word, relation), [getKey, word, relation]);
  const position = React.useMemo(() => getPosition(key), [getPosition, key]);

  const onClick = React.useCallback(
    () => {
      if ((currentWord.word === word && currentWord.relation === relation) || !position) return;

      setLastWord(currentWord.word);
      setChain((chain) => (chain.find(({ word: w }) => w === word)
        ? chain.slice(0, chain.findIndex(({ word: w }) => w === word) + 1)
        : [...chain, { word, relation }]));
    },
    [currentWord.relation, currentWord.word, position, relation, setChain, setLastWord, word],
  );

  // Pick and set a position
  React.useEffect(() => {
    if (!wordRef.current || typeof window === 'undefined' || loadingPositions) return;

    // If we already have a position, don't continue!
    if (position) return;

    // Define our own here -- too important to leave up to state bullshit
    const [screenWidth, screenHeight] = [window.innerWidth, window.innerHeight];

    const width = wordRef.current.offsetWidth;
    const height = wordRef.current.offsetHeight;

    // If start word, just make sure it's centered
    if (!relation) {
      if (position?.x !== screenWidth / 2 || position?.y !== screenHeight / 2) setPosition(key, {
        x: screenWidth / 2,
        y: screenHeight / 2,
        width,
        height,
        offset: { x: 0, y: 0 },
        center: null,
        word,
        relation,
      });

      return;
    }

    const radius = Math.hypot(width, height);
    const angle = (seedrandom(key)() - 0.5) * (Math.PI / 3) + relations[relation].angle;

    const [x, y] = [radius * Math.cos(angle), radius * Math.sin(angle)];

    const cell = getWordPosition({
      x,
      y,
      width,
      height,
      center,
    }, activePositions);

    const positionData = {
      x: center.x + cell.x,
      y: center.y + cell.y,
      offset: { ...cell },
      center: { ...center },
      width,
      height,
      word,
      relation,
    };

    activePositions.push({ ...positionData, word, relation, key });
    setPosition(key, positionData);
  }, [activePositions, center, position, relatedWords, relation, setPosition, word, loadingPositions, key]);

  return (
    <button
      type="button"
      onClick={onClick}
      ref={wordRef}
      key={position?.key}
      className={clsx(
        'absolute hover:z-50 transition duration-500 p-2 rounded-md shadow-md items-center align-middle select-none outline-none appearance-none',
        {
          'scale-75 grayscale-[25]': !!chain.slice(0, chain.length - 1).find((link) => link.word === word && link.relation === relation),
          'bg-ant': relation === 'antonym',
          'bg-syn': relation === 'synonym',
          'bg-rhyme': relation === 'rhyme',
          'bg-null': relation === null,
          'hover:shimmer hover:scale-110 hover:shadow-lg': currentWord.word !== word,
          'opacity-0': !position,
          'opacity-100': !!position,
          'animate-fade': !!position && !chain.find(({ word: w }) => w === word) && lastWord !== word,
          'shimmer animate-goal origin-center': isTarget && currentWord.word !== word,
        },
      )}
      style={{
        ...(position && {
          top: `${position.y - (position.height / 2)}px`,
          left: `${position.x - (position.width / 2)}px`,
        }),
      }}
      onMouseEnter={() => currentWord.word !== word && setHoveredWord({ word, relation })}
      onMouseLeave={() => currentWord.word !== word && setHoveredWord(null)}
    >
      <span className="relative">
        <div className="bg-gray-200 h-11 w-36 rounded-md elevated-xs font-franklin text-gray-800 text-lg flex justify-center items-center">
          {word}
        </div>
      </span>
    </button>
  );
}
