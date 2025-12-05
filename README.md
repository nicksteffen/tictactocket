# TicTacTocket

TicTacTocket is a real-time multiplayer implementation of **Ultimate Tic-Tac-Toe**, built with [Nuxt 3](https://nuxt.com/). It features online play via WebSockets as well as a challenging AI opponent.

## Game Description

Ultimate Tic-Tac-Toe is a strategic variation of the classic game. It consists of a 3x3 grid of smaller 3x3 Tic-Tac-Toe boards.

**Rules:**
1. Each turn, a player marks a cell in one of the small boards.
2. The board a player must play in next is determined by the relative position of the cell marked by the previous player. (e.g., if Player X marks the top-right cell of a small board, Player O must play in the top-right small board).
3. If a player is sent to a board that is already won or full, they can choose any available board to play in.
4. Winning a small board awards that board's position to the winner in the "global" 3x3 grid.
5. The objective is to win three small boards in a row (horizontally, vertically, or diagonally) to win the game.

## Features

- **Real-time Multiplayer:** Play against friends instantly using WebSockets.
- **AI Opponent:** Challenge a heuristic-based AI player.
- **Interactive UI:** Responsive and animated design for a smooth gaming experience.
- **Game State Management:** Robust state handling for valid moves, board availability, and win conditions.

## Technology Stack

This project is built using modern web development tools:

- **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Real-time Communication:** WebSockets (using `nuxt-socket-io` / `useWebSocket` from `@vueuse/core`)
- **Icons:** [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **Testing:** [Jest](https://jestjs.io/) with `ts-jest`

## Setup & Development

### Prerequisites

- Node.js (Latest LTS recommended)
- npm, pnpm, yarn, or bun

### Installation

Install the dependencies:

```bash
# npm
npm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### Running Tests

Run the unit test suite:

```bash
npm test
```

### Production Build

Build the application for production:

```bash
# npm
npm run build
```

Preview the production build locally:

```bash
# npm
npm run preview
```

## Project Structure

- `app/`: Frontend application logic (components, pages, stores).
- `server/`: Backend logic, including socket handlers and game domain models.
  - `domain/`: Core game logic (AI, Board state, validation).
  - `handlers/`: WebSocket event handlers.
  - `api/`: API endpoints and socket configuration.
- `tests/`: Unit tests.

## License
[MIT](LICENSE) (or assumed proprietary if not specified)
