'use client';

import clsx from 'clsx';
import React from 'react';
import NymsContext from '../../context/NymsContext';
import useRelatedWords from '../../hooks/useRelatedWords';
import useScreenSize from '../../hooks/useScreenSize';
import useStorage from '../../hooks/useStorage';
import Instructions from './Instructions';
import Victory from './Victory';
import Words from './Words';

export default function Game({ puzzle }) {
  const [screenWidth, screenHeight] = useScreenSize();
  const [chain, setChain] = useStorage('chain', [{ word: puzzle.start, relation: null }]);
  const [positions, setPositions] = useStorage('positions', []);
  const positionsRef = React.useRef(positions);
  const [hoveredWord, setHoveredWord] = React.useState(null);
  const [scale, setScale] = React.useState(1);

  const currentWord = React.useMemo(() => chain[chain.length - 1], [chain]);
  const wordsSinceRhyme = React.useMemo(
    () => (chain.length - 1) - chain.findLastIndex(({ relation }) => relation === 'rhyme'),
    [chain],
  );

  const relatedWords = useRelatedWords(currentWord, chain, wordsSinceRhyme >= 4);

  // Callbacks
  const getKey = React.useCallback((word, relation) => {
    const indexInChain = chain.findIndex(({ word: w }) => w === word);
    const key = `${chain
      .slice(0, indexInChain === -1 ? chain.length : indexInChain)
      .map((link) => `${link.word}:${link.relation}`).join(',')},${word}:${relation}`;

    return key;
  }, [chain]);

  const setPosition = React.useCallback((word, relation, position) => {
    const key = getKey(word, relation);

    // Update ref first
    positionsRef.current = [
      ...positionsRef.current.filter((position) => position.key !== key),
      { ...position, key, word, relation },
    ];

    return setPositions(positionsRef.current);
  }, [getKey, setPositions]);

  const getPosition = React.useCallback((word, relation) => {
    const key = getKey(word, relation);

    return positions && positionsRef.current.find((position) => position.key === key);
  }, [getKey, positions]);

  const getActivePositions = React.useCallback(
    () => positions && positionsRef.current
      .filter(({ word, relation, key }) => chain.find((link) => (getKey(word, relation) === getKey(link.word, link.relation))
      || (relatedWords?.find((rw) => key === getKey(rw.word, rw.relation))))),
    [chain, getKey, positions, relatedWords],
  );

  const center = React.useMemo(() => {
    const position = getPosition(currentWord.word, currentWord.relation);
    if (!position) return {
      word: currentWord.word,
      relation: currentWord.relation,
      x: screenWidth / 2,
      y: screenHeight / 2,
    };

    return position;
  }, [currentWord, getPosition, screenHeight, screenWidth]);

  const nymsContext = React.useMemo(() => ({
    chain,
    setChain,
    hoveredWord,
    setHoveredWord,
    currentWord,
    relatedWords,
    wordsSinceRhyme,
    puzzle,
    scale,
    setScale,
    center,
    positions,
    positionsRef,
    getActivePositions,
    setPosition,
    getPosition,
    getKey,
  }), [chain, setChain, hoveredWord, currentWord, relatedWords, wordsSinceRhyme, puzzle, scale, center, positions, getActivePositions, setPosition, getPosition, getKey]);

  // Update positions ref
  React.useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  React.useEffect(() => {
    // If not on the most recent puzzle, reset
    if (puzzle && chain?.[0].word !== puzzle.start) {
      localStorage.clear();
      positionsRef.current = [];
      setPositions(positionsRef.current);
      setHoveredWord(null);
      setScale(1);
      setChain([{ word: puzzle.start }]);
    }
  }, [chain, puzzle, setChain, setPositions]);

  return (
    <div className="w-full h-full overflow-hidden">
      <NymsContext.Provider value={nymsContext}>
        <Instructions end={puzzle?.end} className={clsx('transition z-10', { 'opacity-0': chain?.length >= 2, 'animate-fade': chain?.length < 2 })} />
        <Words />
        <Victory chain={chain} puzzle={puzzle} />
      </NymsContext.Provider>
    </div>
  );
}
