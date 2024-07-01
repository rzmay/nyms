import React from 'react';
import NymsContext from '../../context/NymsContext';
import useScreenSize from '../../hooks/useScreenSize';
import Graphics from './Graphics';
import Word from './Word';

export default function Words() {
  const {
    chain, currentWord, setScale, getActivePositions, getPosition, scale, relatedWords, center, getKey, puzzle,
  } = React.useContext(NymsContext);
  const [screenWidth, screenHeight] = useScreenSize();
  const containerRef = React.useRef(null);

  // Zoom to fit all words
  React.useEffect(() => {
    if (!relatedWords || currentWord.word === puzzle.end) return setScale(1);

    const { x: farthestX, y: farthestY } = getActivePositions()
      .filter(({ word, relation }) => !chain.find((chainWord) => chainWord.word === word && chainWord.relation === relation))
      .reduce((farthest, next) => {
        if (!(farthest.x && farthest.y)) return { x: { ...next }, y: { ...next } };

        if (Math.abs(farthest.x.x - center.x) < Math.abs(next.x - center.x)) farthest.x = { ...next };
        if (Math.abs(farthest.y.y - center.y) < Math.abs(next.y - center.y)) farthest.y = { ...next };

        return farthest;
      }, {});

    if (!(farthestX && farthestY)) return setScale(1);

    // Distance from center to edge / distance from center to farthest edge of farthest word
    const zoomFactor = Math.min(
      (screenWidth / 2) / (Math.abs(farthestX.x - center.x) + farthestX.width / 2),
      (screenHeight / 2) / (Math.abs(farthestY.y - center.y) + farthestY.height / 2),
    );
    setScale(Math.min(zoomFactor, 1));
  }, [getActivePositions, center, currentWord, getPosition, relatedWords, screenHeight, screenWidth, setScale, chain, puzzle.end]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full transition-transform duration-500"
      style={{
        transform: `scale(${scale}) translate(${(screenWidth / 2) - (center.x)}px, ${(screenHeight / 2) - (center.y)}px)`,
        transformOrigin: `${center.x} ${center.y}`,
      }}
    >
      <Graphics />
      {chain.map(({ word, relation }) => (
        <Word
          key={getKey(word, relation)}
          word={word}
          relation={relation}
        />
      ))}
      {currentWord.word !== puzzle.end && relatedWords
        ?.filter(({ prior }) => prior === currentWord.word)
        ?.map(({ word, relation }) => (
          <Word
            key={getKey(word, relation)}
            word={word}
            relation={relation}
          />
        ))}
    </div>
  );
}
