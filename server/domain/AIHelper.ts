import { Move } from "./AIPlayer";
import { UltimateBoard } from "./UltimateBoard";
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


// Helper to check if playing a 'target' value at 'index' on a 'smallBoard' will win it.
export function isWinningMove(board: number[], index: number, target: number): boolean {
    const tempBoard = [...board];
    tempBoard[index] = target;
    
    // WIN_CONDITIONS should be the array of 8 win combos: [[0,1,2], [0,3,6], ...]
    return WIN_CONDITIONS.some(condition =>
        condition.every(i => tempBoard[i] === target)
    );
}

// 1. & 2. Overall Win/Block Check
export function checkOverallWin(ultimateBoard: UltimateBoard, availableBoardIds: number[], player: number): Move {
    const opponent = player === 1 ? 2 : 1;
    const overallBoard = ultimateBoard.boards.map(b => b.winner);
    
    for (const boardId of availableBoardIds) {
        const smallBoard = ultimateBoard.boards[boardId];
        
        // Iterate through all empty cells on the available small board
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (smallBoard.board[cellIndex] === 0) {
                
                // If this move WINS the small board...
                if (isWinningMove(smallBoard.board, cellIndex, player)) {
                    
                    // ... and if winning the small board WINS the overall board...
                    if (isWinningMove(overallBoard, boardId, player)) {
                        // 🥇 FOUND THE GAME-WINNING MOVE
                        return { boardId, cellIndex };
                    }
                }
            }
        }
    }
    return null;
}

// 3. & 4. Small Board Win/Block Check
export function checkSmallBoardWin(ultimateBoard: UltimateBoard, availableBoardIds: number[], player: number): Move {
    const opponent = player === 1 ? 2 : 1;
    
    // Priority: Win a small board
    for (const boardId of availableBoardIds) {
        const smallBoard = ultimateBoard.boards[boardId];
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (smallBoard.board[cellIndex] === 0) {
                if (isWinningMove(smallBoard.board, cellIndex, player)) {
                    // This move wins the small board, but doesn't win the overall game (Rule 1 failed).
                    return { boardId, cellIndex }; 
                }
            }
        }
    }
    return null;
}

export function checkSmallBoardBlock(ultimateBoard: UltimateBoard, availableBoardIds: number[], player: number): Move {
    const opponent = player === 1 ? 2 : 1;
    
    // Priority: Block opponent's small board win
    for (const boardId of availableBoardIds) {
        const smallBoard = ultimateBoard.boards[boardId];
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (smallBoard.board[cellIndex] === 0) {
                if (isWinningMove(smallBoard.board, cellIndex, opponent)) {
                    // This move blocks the opponent from winning this small board.
                    return { boardId, cellIndex };
                }
            }
        }
    }
    return null;
}

// 5. & 6. Sending Opponent Strategy
export function checkSendingToWonOrDrawBoard(ultimateBoard: UltimateBoard, availableBoardIds: number[], player: number): Move {
    // Look for a move that sends the opponent to a board that is already resolved (won/drawn)
    for (const boardId of availableBoardIds) {
        const smallBoard = ultimateBoard.boards[boardId];
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (smallBoard.board[cellIndex] === 0) {
                const targetBoard = ultimateBoard.boards[cellIndex];
                // Check if the board we are *sending* the opponent to is unavailable
                if (targetBoard.winner !== 0 || targetBoard.board.every(cell => cell !== 0)) {
                    return { boardId, cellIndex };
                }
            }
        }
    }
    return null;
}

export function checkSendingToCriticalBoard(ultimateBoard: UltimateBoard, availableBoardIds: number[], player: number): Move {
    // Look for a move that sends the opponent to a less strategic board (e.g., edge, not center/corner)
    // The opposite of this is to send them to a non-critical board, but since all open boards are dangerous,
    // this heuristic often means avoiding sending them to the central board (index 4) or a corner (0, 2, 6, 8) 
    // unless necessary. For simplicity, we prioritize sending them *away* from the center board (index 4).
    for (const boardId of availableBoardIds) {
        const smallBoard = ultimateBoard.boards[boardId];
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (smallBoard.board[cellIndex] === 0) {
                // If the move lands the opponent on board 4 (the center), skip it.
                if (cellIndex !== 4) {
                    return { boardId, cellIndex };
                }
            }
        }
    }
    return null;

}

/**
 * Checks if the opponent has an immediate game-winning threat and returns the blocking move.
 * (Rule #2 in the Heuristic Strategy)
 * @param ultimateBoard The current UltimateBoard state.
 * @param availableBoardIds The boards currently available for play.
 * @param player The player making the move (1 or 2).
 * @returns An object containing the boardId and cellIndex for the block, or null.
 */
export function checkOverallBlock(
    ultimateBoard: UltimateBoard,
    availableBoardIds: number[],
    player: number
): Move {
    const opponent = player === 1 ? 2 : 1;
    const overallBoard = ultimateBoard.boards.map(b => b.winner);

    // Iterate through all possible boards the player can play on
    for (const boardId of availableBoardIds) {
        const smallBoard = ultimateBoard.boards[boardId];

        // Iterate through all empty cells on the available small board
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (smallBoard.board[cellIndex] === 0) {

                // Scenario 1: Does making this move WIN the small board for US?
                if (isWinningMove(smallBoard.board, cellIndex, player)) {
                    // If winning the small board means we block the opponent's overall win

                    // Check if, without this move, the opponent is threatening an overall win
                    // by needing this boardId to be resolved in their favor.

                    // We need to look at the overall board's state *if* we manage to win this small board.
                    const tempOverallBoard = [...overallBoard];
                    tempOverallBoard[boardId] = player; // Assume we win this small board

                    // Now, check if the OPPONENT has an overall winning threat
                    // that required this boardId (or another) to be won by *them*.

                    // This check is complex because blocking an overall win often means
                    // the opponent has two of three in a row (e.g., overallBoard[1] and overallBoard[7] are '2'),
                    // and the final piece is an *unresolved* board (e.g., overallBoard[4] is '0').


                    // Focus on the block: Find an opponent threat and see if a move can resolve it.
                    // The easiest block is often a move that sends the opponent to a non-winning board.

                    // --- DIRECT BLOCK CHECK ---
                    // Check if *winning* this small board (boardId) for ourselves would stop an opponent overall win.
                    // The direct block is often simplified: Look for any open board in the overall game
                    // that the opponent can win on their *next* overall turn, assuming they manage to win a small board.

                    for (const overallCondition of WIN_CONDITIONS) {

                        // Check if the opponent has two of three in this overall line (e.g., [0, 4, 8])
                        const opponentCount = overallCondition.filter(i => overallBoard[i] === opponent).length;
                        const emptyCount = overallCondition.filter(i => overallBoard[i] === 0).length;

                        if (opponentCount === 2 && emptyCount === 1) {
                            // Opponent has a one-move-to-win threat on the overall board!
                            const blockingOverallIndex = overallCondition.find(i => overallBoard[i] === 0);

                            // If the blocking piece IS the board we are currently playing on (boardId)
                            if (blockingOverallIndex === boardId) {

                                // Now, we must ensure our move (cellIndex) WINS this small board (boardId)
                                if (isWinningMove(smallBoard.board, cellIndex, player)) {
                                    // 🛑 FOUND THE BLOCKING MOVE! (We win the board they needed for the game win)
                                    return { boardId, cellIndex };
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}