import clsx from 'clsx';
import relations from 'lib/constants/relations';
import React from 'react';
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
  const position = React.useMemo(() => getPosition(word, relation), [getPosition, relation, word]);

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

    // Define our own here -- too important to leave up to state bullshit
    const [screenWidth, screenHeight] = [window.innerWidth, window.innerHeight];

    const width = wordRef.current.offsetWidth;
    const height = wordRef.current.offsetHeight;

    // If start word, just make sure it's centered
    if (!relation) {
      if (position?.x !== screenWidth / 2 || position?.y !== screenHeight / 2) setPosition(word, relation, {
        x: screenWidth / 2,
        y: screenHeight / 2,
        width,
        height,
        offset: { x: 0, y: 0 },
        center: null,
      });

      return;
    }

    // If we've already found a position, just make sure it's center is correct
    if (position) {
      if (
        position.center.word === center.word
        && position.center?.relation === center.relation
        && (position.center.x !== center.x || position.center.y !== center.y)
      ) {
        setPosition(word, relation, {
          ...position,
          center: { ...center },
          x: center.x + position.offset.x,
          y: center.y + position.offset.y,
        });
      }
      return;
    }

    const i = relatedWords.findIndex((rw) => rw.word === word && rw.relation === relation);
    const screenRadius = Math.hypot(screenWidth / 2, screenHeight / 2);
    const minRadius = Math.hypot(1.5 * width, 1.5 * height);

    const radius = Math.max(minRadius, Math.sqrt(i) * (screenRadius / 7)); // Scale radius with the square root of the number of words
    const angle = (Math.random() - 0.5) * (Math.PI / 3) + relations[relation].angle;

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
    };

    activePositions.push({ ...positionData, word, relation, key: getKey(word, relation) });
    setPosition(word, relation, positionData);
  }, [activePositions, center, position, relatedWords, relation, setPosition, word, loadingPositions, getKey]);

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
          'shimmer animate-bounce origin-center': isTarget,
          'hover:shimmer hover:scale-110 hover:shadow-lg': currentWord.word !== word,
          'opacity-0': !position,
          'opacity-100': !!position,
          'animate-fade': !!position && !chain.find(({ word: w }) => w === word) && lastWord !== word,
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
