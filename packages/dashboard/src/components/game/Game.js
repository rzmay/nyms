'use client';

import rules from 'lib/constants/rules';
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

  const [positions, setPositions, loadingPositions] = useStorage('positions', []);

  const [hoveredWord, setHoveredWord] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const [lastWord, setLastWord] = React.useState();

  const [visitedWords, setVisitedWords] = useStorage('visited', [puzzle.start]);
  const [hints, setHints] = useStorage('hints', []);
  const [hintLoading, setHintLoading] = React.useState(false);

  const currentWord = React.useMemo(() => chain[chain.length - 1], [chain]);
  const wordsSinceRhyme = React.useMemo(
    () => (chain.length - 1) - chain.findLastIndex(({ relation }) => relation === 'rhyme'),
    [chain],
  );

  // Subtract 1 from visited words length here as not to include the puzzle start
  const hintsAvailable = React.useMemo(
    () => Math.floor(((visitedWords.length - 1) - (hints.length * rules.hintInterval)) / rules.hintInterval),
    [hints.length, visitedWords.length],
  );

  // Can only use a hint if you've used all the hints you've already gotten
  const canUseHint = React.useMemo(
    () => hintsAvailable > 0 && hints.every(({ used }) => used),
    [hints, hintsAvailable],
  );

  const relatedWords = useRelatedWords(currentWord, chain, wordsSinceRhyme >= rules.rhymeInterval);

  const getHint = React.useCallback(async () => {
    if (!canUseHint || hintLoading) return;

    setHintLoading(true);

    const path = chain.map(({ word }) => word).join(',');
    const res = await fetch(`/api/hint?path=${path}`);
    const hint = await res.json();

    setHintLoading(false);
    setHints((hints) => [...hints, { ...hint, used: false }]);
  }, [canUseHint, hintLoading, setHintLoading, chain, setHints]);

  const setHintUsed = React.useCallback((hint) => {
    setHints((hints) => hints.map((h) => ({
      ...h,
      used: h.used || h === hint || (h.from === hint.from && h.to === hint.to),
    })));
  }, [setHints]);

  const getKey = React.useCallback((word, relation) => {
    const indexInChain = chain.findIndex(({ word: w }) => w === word);
    const key = `${chain
      .slice(0, indexInChain === -1 ? chain.length : indexInChain)
      .map((link) => `${link.word}:${link.relation}`).join(',')},${word}:${relation}`;

    return key;
  }, [chain]);

  const getPosition = React.useCallback(
    (key) => positions.find((position) => position.key === key),
    [positions],
  );

  const activePositions = React.useMemo(
    () => positions
      .filter(({ key }) => chain
        .find((link) => (key === getKey(link.word, link.relation))
      || relatedWords?.find((rw) => key === getKey(rw.word, rw.relation)))),
    [chain, getKey, positions, relatedWords],
  );

  const setPosition = React.useCallback((key, position) => {
    setPositions((currentPositions) => [
      ...currentPositions.filter(({ key: currentKey }) => currentKey !== key),
      {
        ...position,
        key,
      },
    ]);
  }, [setPositions]);

  const reset = React.useCallback(() => {
    localStorage.clear();
    setVisitedWords([puzzle.start]);
    setHints([]);
    setPositions([]);
    setHoveredWord(null);
    setScale(1);
    setChain([{ word: puzzle.start, relation: null }]);
  }, [puzzle.start, setChain, setHints, setPositions, setVisitedWords]);

  const center = React.useMemo(() => {
    const position = getPosition(getKey(currentWord.word, currentWord.relation));
    if (!position) return {
      word: currentWord.word,
      relation: currentWord.relation,
      x: screenWidth / 2,
      y: screenHeight / 2,
    };

    return position;
  }, [currentWord.relation, currentWord.word, getKey, getPosition, screenHeight, screenWidth]);

  const nymsContext = React.useMemo(() => ({
    chain,
    setChain,
    hoveredWord,
    setHoveredWord,
    currentWord,
    lastWord,
    setLastWord,
    relatedWords,
    wordsSinceRhyme,
    puzzle,
    scale,
    setScale,
    center,
    positions,
    loadingPositions,
    activePositions,
    setPosition,
    getPosition,
    getKey,
    visitedWords,
    setVisitedWords,
    hints,
    hintLoading,
    setHints,
    getHint,
    setHintUsed,
    canUseHint,
    hintsAvailable,
    reset,
  }), [chain, setChain, hoveredWord, currentWord, lastWord, relatedWords, wordsSinceRhyme, puzzle, scale, center, positions, loadingPositions, activePositions, setPosition, getPosition, getKey, visitedWords, setVisitedWords, hints, hintLoading, setHints, getHint, setHintUsed, canUseHint, hintsAvailable, reset]);

  React.useEffect(() => {
    // If not on the most recent puzzle, reset
    if (puzzle && chain?.[0].word !== puzzle.start) {
      reset();
    }
  }, [chain, puzzle, reset, setChain, setPositions]);

  return (
    <div className="w-full h-svh overflow-hidden">
      <NymsContext.Provider value={nymsContext}>
        <Instructions />
        <Words />
        <Victory />
      </NymsContext.Provider>
    </div>
  );
}
