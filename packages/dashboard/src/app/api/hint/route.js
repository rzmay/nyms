/* eslint-disable no-await-in-loop */
// app/api/revalidate/route.ts
import { getPuzzle } from 'lib/puzzles';
import { getRelatedWords } from 'lib/words';
import { NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function GET(request) {
  const puzzle = await getPuzzle(null, true);

  const { searchParams } = request.nextUrl;
  const path = searchParams.get('path').split(',');

  /* The hint should not force the player to take the pre-existing path.
    * It should instead just put the player onto that path from wherever
    * they are. So the best method here is finding the latest point in the
    * chain where one of the synonyms/antonyms will put the player onto
    * any point in the path.
    *
    * We start from the last element and iterate backwards until one of the
    * related words available is included in the puzzle's solution, prefering
    * words later in the solution.
    *
    * We also ignore rhymes here -- they are meant to be a route for player
    * creativity to bypass the intended route, so using them in the hint route
    * would defeat the purpose.
    *
    * The iteration should not require a base case, as even in the worst case scenario
    * the first word in the player's path will be the same as the startWord in the
    * solution, so a 'next' should be found from there. If no 'next' is found, it is
    * an error that should not happen.
    *
    * We also must remove the start word from the path in our algorithm, since it would
    * be pointless to return to the start word at any point.
  */

  const solution = puzzle.path.slice(1);
  let index = path.length;
  let next = null;
  while (!next && index >= 0) {
    index -= 1;

    const word = path[index];
    const relatedWords = (await getRelatedWords(word)).map(({ word }) => word);

    [next] = relatedWords
      .filter((w) => !path.includes(w)) // Filter out anything the player has already used
      .filter((w) => solution.includes(w)) // Filter out anything not in the path
      .sort((a, b) => solution.indexOf(b) - solution.indexOf(a)); // Sort to prefer later words
  }

  if (index < 0) return NextResponse.json(
    { error: 'Bad request data, no available hint' },
    { status: 400 },
  );

  return NextResponse.json({ from: path[index], to: next });
}
