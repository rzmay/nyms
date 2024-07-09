import './global.css';
import { getPuzzle } from 'lib/puzzles';
import React from 'react';
import Game from '../components/game/Game';

const now = Date.now();

export default async function Page() {
  const puzzle = await getPuzzle(now);

  return (
    <Game puzzle={puzzle} />
  );
}
