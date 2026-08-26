import { createContext } from 'react';

const NymsContext = createContext({
  chain: null,
  setChain: null,
  hoveredWord: null,
  setHoveredWord: null,
  currentWord: null,
  wordsSinceLastRhyme: 0,
  puzzle: null,
  scale: null,
  setScale: null,
  translation: null,
  setTranslation: null,
  positions: null,
  getActivePositions: null,
  setPosition: null,
  getPosition: null,
  getKey: null,
  reset: null,
});

export default NymsContext;
