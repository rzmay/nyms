# Nyms 🧩

Nyms is a daily word-connection game inspired by the New York Times word games.
Start with one word and navigate a chain of related words until you reach the
target.

## Play the hosted game 🎮

[Play Nyms at nyms.vercel.app](https://nyms.vercel.app)

### How to play

1. Begin at the displayed start word.
2. Choose a suggested **synonym** or **antonym** to extend the chain.
3. Reach the target word in as few steps as possible. Each puzzle has a
   generated **par** score.
4. A **rhyme** becomes available every three words (configurable in
   `packages/lib/constants/rules.js`), giving you another way to move through
   the puzzle.
5. When you reach the target, compare your score and share the relationship
   sequence.

The game saves the current chain and word positions in browser `localStorage`,
so a refresh does not lose progress for the current puzzle.

## How it works ⚙️

Nyms is organized as a Yarn workspaces monorepo:

- `packages/dashboard` contains the Next.js 14 application and React game UI.
  The server-rendered page loads the current puzzle, while the client-side
  `Game` component manages the chain, suggestions, canvas positions, zoom, and
  victory state.
- `packages/lib` contains shared puzzle and word logic. It calls the Datamuse
  API for synonyms, antonyms, and rhymes, filters suggestions to single
  alphabetic words, and exposes the same helpers to the dashboard, worker, and
  CLI.
- `packages/worker` generates and persists daily puzzles. A `node-cron` job runs
  at midnight, chooses a random starting word, recursively traverses unused
  related words, rejects unsuitable endpoints, and writes the resulting start
  word, end word, and par to Google Sheets.
- `packages/cli` provides a small terminal client for playing with the shared
  word utilities.

Puzzle rows are read from `Sheet1!A:D` and matched against the current date
using Day.js. Google Sheets is used as the lightweight puzzle data store;
Datamuse supplies the relationship graph at runtime. Relation types are
represented by `synonym`, `antonym`, and `rhyme` metadata, including their API
query codes, colors, and share emojis.

## Local development 🛠️

### Requirements

- Node.js
- Yarn
- Access to the project environment variables through Infisical, or equivalent
  local environment configuration
- A Google service account and spreadsheet for puzzle storage

Install dependencies from the repository root:

```sh
yarn install
```

Run the dashboard:

```sh
yarn workspace dashboard dev
```

Run the puzzle worker separately when generating daily puzzles locally:

```sh
yarn workspace worker dev
```

The worker and dashboard expect these environment variables:

| Variable                       | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| `SPREADSHEET_ID`               | Google Sheet containing the puzzle rows          |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account used by the Sheets client |
| `GOOGLE_PRIVATE_KEY`           | Private key for that service account             |

The dashboard can be built and started with:

```sh
yarn workspace dashboard build
yarn workspace dashboard start
```

Lint the entire workspace with:

```sh
yarn lint
```

## Deployment 🚀

The dashboard is configured for deployment on Vercel. The worker is a separate
long-running process and can be started with `npm run start --workspace=worker`,
as described by the root `Procfile`. Both services need access to the shared
Google Sheets credentials and spreadsheet configuration.
