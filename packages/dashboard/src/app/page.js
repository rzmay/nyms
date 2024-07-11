import './global.css';
import { getPuzzle } from 'lib/puzzles';
import React from 'react';
import Game from '../components/game/Game';

export default async function Page() {
  const [now] = React.useState(Date.now());
  const puzzle = await getPuzzle(now);

  return (
    <Game puzzle={puzzle} />
  );
}
