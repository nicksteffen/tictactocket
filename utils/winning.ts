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
export function checkIfWon(board: Number[], target: number): boolean {
    return WINNING_STATES.some(condition => checkWinCondition(board, condition, target));
}