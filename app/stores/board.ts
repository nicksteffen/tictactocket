import { defineStore } from 'pinia';


import type { boardState, smallBoardState } from '../../types/index';

// All possible winning combinations for a 3x3 board
const WINNING_STATES = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6], // Diagonal top-right to bottom-left
];

/**
 * Checks if a specific win condition is met on the board
 * @param board - The board array to check
 * @param winCondition - Array of indices representing a winning pattern
 * @param target - The player value to check for (1 or 2)
 * @returns true if all positions in the win condition match the target
 */
function checkWinCondition(board: Number[], winCondition: number[], target: number): boolean {
    return winCondition.every((index) => board[index] === target);
}

/**
 * Checks if a player has won on the given board
 * @param board - The board array to check
 * @param target - The player value to check for (1 or 2)
 * @returns true if the target player has won
 */
function checkIfWon(board: Number[], target: number): boolean {
    return WINNING_STATES.some(condition => checkWinCondition(board, condition, target));
}

function initializeSmallBoard(index: number) {
    return {
        board: Array.from({ length: 9 }, () => 0),
        isAvailable: true,
        winner: 0,
        maxRows: 3,
        maxCols: 3,
        index: index,
    };

}

const { data, send } = useWebSocket('ws://localhost:3000/api/gameSocket');
function requestMove(gameId: string, boardId: number, index: number, target: number, playerId: number) {
    const move = {
        gameId: gameId,
        boardId: boardId,
        index: index,
        target: target,
        playerId: playerId,
    };
    const payload = {
        type: 'move',
        move: move,
    };
    send(JSON.stringify(payload));

}


export const useBoardStore = defineStore('board', {
    state: () => ({
        boardState: {} as boardState,
        currentPlayer: 1,
        nextBoard: -1,
    }),
    actions: {
        syncBoardState(boardState: boardState, nextBoard: number, currentPlayer: number) {
            // todo, I think this should be called sync Game State
            console.log("sync in actions")
            this.boardState = boardState;
            this.nextBoard = nextBoard;
            this.currentPlayer = currentPlayer;
        },
        reset() {
            this.boardState = {} as boardState;
            this.currentPlayer = 1;
            this.nextBoard = -1;
            this.initializeBoard();
        },
        initializeBoard() {
            this.boardState = {
                // Use '_' for the value argument and 'index' for the array index argument
                boards: Array.from({ length: 9 }, (_, index: number) => initializeSmallBoard(index)),
                winner: 0,
                maxRows: 3,
                maxCols: 3,
            };
        },
        makeMove(gameId: string, boardId: number, index: number, target: number) {
            // const smallBoard = this.boardState.boards[boardId];
            // if (!smallBoard) {
            //     throw new Error('Invalid board: Board ID not found.');
            // }

            // // Check if the board is available for play
            // if (!smallBoard.isAvailable) {
            //     throw new Error('Invalid move: This board is not available for play.');
            // }

            // // Enforce nextBoard restrictions
            // if (this.nextBoard !== -1 && this.nextBoard !== boardId) {
            //     throw new Error(`Invalid move: You must play in board ${this.nextBoard}.`);
            // }

            // if (smallBoard.board[index] !== 0) {
            //     throw new Error('Invalid move: Cell is already occupied.');
            // }

            // Make the move
            // smallBoard.board[index] = target;
            requestMove(gameId, boardId, index, target, this.currentPlayer);


            // // Check if the board is now full (no 0's left)
            // const isBoardFull = smallBoard.board.every(cell => cell !== 0);
            // if (isBoardFull && smallBoard.winner === 0) {
            //     // Board is full but no winner (draw)
            //     smallBoard.isAvailable = false;
            //     console.log('Small board ' + boardId + ' is full (draw)');
            // }

            // // Check if this move won the small board
            // if (checkIfWon(smallBoard.board, target)) {
            //     smallBoard.winner = target;
            //     smallBoard.isAvailable = false;
            //     console.log('Small board won: ' + target + ' on board ' + boardId);

            //     // Check if this small board win resulted in winning the overall game
            //     // Create an array representing the overall board state (winners of each small board)
            //     const overallBoard = this.boardState.boards.map(board => board.winner);
            //     if (checkIfWon(overallBoard, target)) {
            //         this.boardState.winner = target;
            //         alert('Player ' + target + ' wins!');
            //     }
            // }

            // // Switch to next player
            // this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;

            // // Set the next board based on the cell index played
            // // If that board is unavailable, allow play on any available board
            // const targetNextBoard = this.boardState.boards[index];
            // if (targetNextBoard && targetNextBoard.isAvailable) {
            //     this.nextBoard = index;
            // } else {
            //     this.nextBoard = -1; // Allow play on any available board
            //     console.log('Next board (' + index + ') is unavailable. Player can choose any available board.');
            // }
        }
    }
})

