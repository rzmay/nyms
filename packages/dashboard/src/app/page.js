import './global.css';
import { getPuzzle } from 'lib/puzzles';
import React from 'react';
import Game from '../components/game/Game';

export default async function Page() {
  const puzzle = await getPuzzle(Date.now());

  return (
    <Game puzzle={puzzle} />
  );
}
