import type { boardState, smallBoardState } from '../../types/index';
import { checkIfWon } from '../../utils/winning';

interface ServerGameState {
    gameId: string;
    players: {
        [playerId: string]: {
            name: string;
            peer: any; // Peer type is not easily available here
        }
    };
    board: boardState | null;
    currentPlayer: number;
    nextBoard: number;
}

const gameManager = new Map<string, ServerGameState>();


const initializeBoard = () => {
    return {
        boards: Array.from({ length: 9 }, (_, index: number) => initializeSmallBoard(index)),
        winner: 0,
        maxRows: 3,
        maxCols: 3,
    };
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

function checkIfSmallBoardDraw(smallBoard: smallBoardState) {
    // we know the small board is not a winner
    const isBoardFull = smallBoard.board.every((cell) => cell !== 0);
    if (isBoardFull) {
        smallBoard.isAvailable = false;
    }
    return isBoardFull;
}

function checkIfSmallBoardWin(smallBoard: smallBoardState, target: number) {

    if (smallBoard) {
        const winner = checkIfWon(smallBoard.board, target);
        if (winner) {
            smallBoard.winner = target;
            smallBoard.isAvailable = false;
        }
        return winner;
    }
    return false
}

const checkGameWon = (board: boardState, target: number) => {
    const overallBoard = board.boards.map((board) => board.winner);
    const winner = checkIfWon(overallBoard, target);
    if (winner) {
        board.winner = target;
        return true;
    }
    return false;
}

function updateBoard(move: any, board: boardState) {
    const smallBoard = board.boards[move.boardId];
    console.log("update board")
    smallBoard.board[move.index] = move.target;
    const winner = checkIfSmallBoardWin(smallBoard, move.target);
    if (winner) {
        checkGameWon(board, move.target);
    } else {
        checkIfSmallBoardDraw(smallBoard);
    }

    return board;
}

function getNextBoard(moveIndex: number, board: boardState) {
    const targetNextBoard = board.boards[moveIndex];
    if (targetNextBoard.isAvailable) {
        return moveIndex;
    } else {
        return -1
    }
}

function validateMove(smallBoard: smallBoardState, index: number, boardId: number, nextBoard: number) {
    // todo, return the error messages and a false, so we can send the error back to our peer

    if (!smallBoard) {
        throw new Error('Invalid board: Board ID not found.');
    }

    // Check if the board is available for play
    if (!smallBoard.isAvailable) {
        throw new Error('Invalid move: This board is not available for play.');
    }

    // Enforce nextBoard restrictions
    if (nextBoard !== -1 && nextBoard !== boardId) {
        throw new Error(`Invalid move: You must play in board ${nextBoard}.`);
    }

    if (smallBoard.board[index] !== 0) {
        throw new Error('Invalid move: Cell is already occupied.');
    }

}


function handleJoin(peer: any, data: any) {
    console.log('Joining game ' + data.gameId);
    const gameId = data.gameId;
    const playerName = data.playerName;
    // for now, set the joining player as player 2. in the future, check for player 2 existing, then this player becomes spectator
    // maybe this can be player role
    const playerId = 2;

    const game = gameManager.get(gameId);
    console.log(game)
    if (game) {
        game.players[playerId] = {
            name: playerName,
            peer: peer
        };
        peer.subscribe(gameId);
        const message = JSON.stringify({
            type: 'playerJoined',
            gameId,
            playerName,
            board: game.board,
            currentPlayer: game.currentPlayer,
            nextBoard: game.nextBoard
        });
        peer.publish(gameId, message);
        peer.send(message);
    } else {
        // Handle error or create? For now just log
        console.log(`Game ${gameId} not found`);
    }
}

function handleCreate(peer: any, data: any) {
    if (gameManager.has(data.gameId)) {
        const message = JSON.stringify({ type: 'error', message: 'Game already exists' });
        console.log(`Game ${data.gameId} already exists`);
        peer.publish(data.gameId, message);
        peer.send(message);
        return;
    }
    console.log('Creating game ' + data.gameId);
    const gameId = data.gameId;
    const playerName = data.playerName;
    // game creator is player 1
    const playerId = 1;

    const newGame: ServerGameState = {
        gameId,
        players: {
            [playerId]: {
                name: playerName,
                peer: peer
            }
        },
        board: initializeBoard(),
        currentPlayer: playerId,
        nextBoard: -1,
    };

    gameManager.set(gameId, newGame);
    peer.subscribe(gameId);
    const message = JSON.stringify({
        type: 'gameStarted',
        gameId,
        playerName,
        board: newGame.board,
        currentPlayer: newGame.currentPlayer,
        nextBoard: newGame.nextBoard
    });
    peer.publish(gameId, message);
    peer.send(message);
}

function handleMove(peer: any, data: any) {
    const move = data.move
    const gameId = move.gameId;
    const playerId = move.playerId;
    const game = gameManager.get(gameId);
    if (game && game.board) {
        if (playerId !== game.currentPlayer) {
            console.log('Invalid player: Player ID does not match current player.');
            return;
        }
        try {
            validateMove(game.board.boards[move.boardId], move.index, move.boardId, game.nextBoard);
        } catch (e) {
            console.log(e);
            return;
        }

        game.board = updateBoard(move, game.board);
        console.log("player id is: " + playerId);
        game.currentPlayer = game.currentPlayer === 1 ? 2 : 1;
        game.nextBoard = getNextBoard(move.index, game.board);
        const message = JSON.stringify({
            type: 'moveConfirmed',
            gameId,
            playerId,
            move,
            board: game.board,
            nextBoard: game.nextBoard,
            currentPlayer: game.currentPlayer
        });
        peer.publish(gameId, message);
        peer.send(message);
    } else {
        // Handle error or create? For now just log
        console.log(`Game ${gameId} not found`);
    }
}

function handleReset(peer: any, data: any) {
    const gameId = data.gameId;
    const game = gameManager.get(gameId);
    if (game) {
        game.board = initializeBoard();
        game.currentPlayer = 1;
        game.nextBoard = -1;
        const message = JSON.stringify({
            type: 'boardReset',
            gameId,
            board: game.board,
            currentPlayer: game.currentPlayer,
            nextBoard: game.nextBoard
        });
        peer.publish(gameId, message);
        peer.send(message);
    } else {
        // Handle error or create? For now just log
        console.log(`Game ${gameId} not found`);
    }
}

export default defineWebSocketHandler({
    open(peer) {
        console.log('WebSocket connection opened');
    },
    close(peer) {
        console.log('WebSocket connection closed');
    },
    message(peer, message) {
        console.log('WebSocket message received:', message);
        const data = JSON.parse(message.text());

        if (data.type === 'join') {
            handleJoin(peer, data);
        }
        if (data.type === 'create') {
            handleCreate(peer, data);
        }
        if (data.type === 'move') {
            handleMove(peer, data);
        }
        if (data.type === 'reset') {
            handleReset(peer, data);
        }
    },
})

