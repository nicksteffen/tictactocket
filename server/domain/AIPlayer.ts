import { UltimateBoard } from "./UltimateBoard";
import { SmallBoard } from "./SmallBoard";
import { checkOverallWin, checkSendingToCriticalBoard, checkSendingToWonOrDrawBoard, checkSmallBoardBlock, checkSmallBoardWin, checkOverallBlock, isWinningMove } from "./AIHelper";
const WIN_CONDITIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6], // Diagonal top-right to bottom-left
];


// Define the return type for the move
export type Move = {
    boardId: number;
    cellIndex: number;
} | null;

const PLAYER_VALUE = 1;
const OPPONENT_VALUE = 2;

/**
 * Finds a 'good enough' move using a prioritized set of heuristic rules.
 * @param ultimateBoard The current UltimateBoard state.
 * @param nextBoardId The required SmallBoard ID for the next move (-1 means any board).
 * @param targetPlayer The player making the move (1 or 2).
 * @returns An object containing the boardId and cellIndex, or null if no move is available.
 */
export function getHeuristicMove(
    ultimateBoard: UltimateBoard,
    nextBoardId: number,
    targetPlayer: number
): Move {

    // Determine which boards are available to play on
    const availableBoardIds = nextBoardId === -1
        ? ultimateBoard.boards
            .filter(b => b.isAvailable && b.winner === 0)
            .map(b => b.index)
        : ultimateBoard.boards[nextBoardId].isAvailable && ultimateBoard.boards[nextBoardId].winner === 0
            ? [nextBoardId]
            : [];

    if (availableBoardIds.length === 0) {
        return null; // No available boards
    }

    // --- HEURISTIC STRATEGY PRIORITY ---
    // 1. Win the game immediately (Overall Board)
    // 2. Block the opponent from winning the game immediately (Overall Board)
    // 3. Win the small board immediately
    // 4. Block the opponent from winning the small board immediately
    // 5. Send the opponent to a board that is already won or drawn (Free-Win Strategy)
    // 6. Send the opponent to a *critical* small board (e.g., center or corner)
    // 7. Pick the center cell (best local position)
    // 8. Pick any corner cell
    // 9. Pick any available cell

    // The order of these rules is critical for the AI's strength.

    for (const rule of [
        checkOverallWin,
        checkOverallBlock,
        checkSmallBoardWin,
        checkSmallBoardBlock,
        checkSendingToWonOrDrawBoard,
        checkSendingToCriticalBoard,
    ]) {
        const move = rule(ultimateBoard, availableBoardIds, targetPlayer);
        if (move) return move;
    }

    // If no strong tactical move, rely on positional heuristics
    for (const boardId of availableBoardIds) {
        const board = ultimateBoard.boards[boardId];

        // 7. Center
        if (board.board[4] === 0) return { boardId, cellIndex: 4 };

        // 8. Corners
        for (const cellIndex of [0, 2, 6, 8]) {
            if (board.board[cellIndex] === 0) return { boardId, cellIndex };
        }

        // 9. Any edge cell (Last resort)
        for (const cellIndex of [1, 3, 5, 7]) {
            if (board.board[cellIndex] === 0) return { boardId, cellIndex };
        }
    }

    return null; // Should not happen if availableBoardIds is not empty
}

