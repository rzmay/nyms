import clsx from 'clsx';
import relations from 'lib/constants/relations';
import React from 'react';
import NymsContext from '../../context/NymsContext';
import rectOverlap from '../../helpers/rectOverlap';

export default function Word({
  word, relation = null,
}) {
  const {
    currentWord, setPosition, getPosition, getActivePositions, puzzle, center, chain, setChain, relatedWords, setHoveredWord,
  } = React.useContext(NymsContext);
  const wordRef = React.useRef(null);

  const isTarget = React.useMemo(() => word === puzzle.end, [puzzle.end, word]);
  const position = React.useMemo(() => getPosition(word, relation), [getPosition, relation, word]);

  const onClick = React.useCallback(
    () => {
      if ((currentWord.word === word && currentWord.relation === relation) || !position) return;

      setChain((chain) => (chain.find(({ word: w }) => w === word)
        ? chain.slice(0, chain.findIndex(({ word: w }) => w === word) + 1)
        : [...chain, { word, relation }]));
    },
    [currentWord, position, relation, setChain, word],
  );

  // Pick and set a position
  React.useEffect(() => {
    if (!wordRef.current || typeof window === 'undefined') return;

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
        && (position?.center.x !== center.x || position?.center.y !== center.y)
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

    let radius = Math.max(minRadius, Math.sqrt(i) * (screenRadius / 7)); // Scale radius with the square root of the number of words
    let angle = (Math.random() - 0.5) * (Math.PI / 4) + relations[relation].angle;

    let x;
    let y;
    const offset = { x, y };

    offset.x = radius * Math.cos(angle);
    offset.y = radius * Math.sin(angle);

    x = center.x + offset.x;
    y = center.y + offset.y;

    const activePositions = getActivePositions();

    let it = 0;
    // eslint-disable-next-line no-loop-func
    while (it < 50 && activePositions.some((pos) => rectOverlap({
      x: x - 10,
      y: y - 10,
      width: width + 20,
      height: height + 20,
    }, pos))) {
      offset.x = radius * Math.cos(angle);
      offset.y = radius * Math.sin(angle);

      x = center.x + offset.x;
      y = center.y + offset.y;

      it++;
      angle += (Math.random() - 0.5) * (Math.PI / 2); // Add some randomization to the angle
      radius = Math.max(minRadius, radius + (Math.random() - 0.5) * (screenRadius / 10)); // Add some randomization to the radius
    }

    setPosition(word, relation, {
      x,
      y,
      offset,
      center: { ...center },
      width,
      height,
    });
  }, [getActivePositions, center, position, relatedWords, relation, setPosition, word]);

  return (
    <button
      type="button"
      onClick={onClick}
      ref={wordRef}
      className={clsx(
        'absolute hover:z-50 transition duration-500 p-2 rounded-md shadow-md items-center align-middle select-none outline-none appearance-none',
        {
          'scale-75 grayscale-[25]': !!chain.slice(0, chain.length - 1).find((link) => link.word === word && link.relation === relation),
          'bg-ant': relation === 'antonym',
          'bg-syn': relation === 'synonym',
          'bg-rhyme': relation === 'rhyme',
          'bg-null': relation === null,
          'shimmer animate-bounce origin-center': isTarget,
          'cursor-default pointer-events-none': !onClick,
          'hover:shimmer hover:scale-110 hover:shadow-lg': !!onClick,
          'opacity-0': !position,
          'opacity-100': !!position,
          'animate-fade': !chain.find(({ word: w }) => w === word),
        },
      )}
      style={{
        ...(position && {
          top: `${position.y - (position.height / 2)}px`,
          left: `${position.x - (position.width / 2)}px`,
        }),
      }}
      onMouseEnter={() => !!onClick && setHoveredWord({ word, relation })}
      onMouseLeave={() => !!onClick && setHoveredWord(null)}
    >
      <span className="relative">
        <div className="bg-gray-200 h-11 w-36 rounded-md elevated-xs font-franklin text-gray-800 text-lg flex justify-center items-center">
          {word}
        </div>
      </span>
    </button>
  );
}
