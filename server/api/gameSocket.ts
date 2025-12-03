import { UltimateBoard } from '../domain/UltimateBoard';

interface ServerGameState {
    gameId: string;
    players: {
        [playerId: string]: {
            name: string;
            peer: any; // Peer type is not easily available here
        }
    };
    board: UltimateBoard;
    currentPlayer: number;
    nextBoard: number;
}

const gameManager = new Map<string, ServerGameState>();


// this could be moved to domain for GameState?
function validateMove(game: ServerGameState, index: number, boardId: number, playerId: number) {
    if (playerId !== game.currentPlayer) {
        throw new Error(`Invalid move: Player ${playerId} is not the current player.`);
    }
    try {
        game.board.boards[boardId].validateMove(index, boardId);
    } catch (error) {
        throw error;
    }
    // Enforce nextBoard restrictions
    if (game.nextBoard !== -1 && game.nextBoard !== boardId) {
        throw new Error(`Invalid move: You must play in board ${game.nextBoard}.`);
    }

}


function handleJoin(peer: any, data: any) {
    console.log('Joining game ' + data.gameId);
    const gameId = data.gameId;
    const playerName = data.playerName;
    // for now, set the joining player as player 2. in the future, check for player 2 existing, then this player becomes spectator
    // maybe this can be player role
    const playerId = 2;
    // todo, search for player id in the game.get
    // if found, return the player role or something, else 2 or 3 or whatever?

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
            board: game.board.getUltimateBoardDto(),
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
        board: new UltimateBoard(),
        // board: initializeBoard(),
        currentPlayer: playerId,
        nextBoard: -1,
    };

    gameManager.set(gameId, newGame);
    peer.subscribe(gameId);
    const message = JSON.stringify({
        type: 'gameStarted',
        gameId,
        playerName,
        board: newGame.board.getUltimateBoardDto(),
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
        try {
            validateMove(game, move.index, move.boardId, move.playerId);
        } catch (e) {
            console.log(e);
            return;
        }

        game.board.update(move.boardId, move.index, move.target);
        console.log(game.board)
        game.currentPlayer = game.currentPlayer === 1 ? 2 : 1;
        game.nextBoard = game.board.getNextBoard(move.index)
        const message = JSON.stringify({
            type: 'moveConfirmed',
            gameId,
            playerId,
            move,
            board: game.board.getUltimateBoardDto(),
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
        game.board = new UltimateBoard();
        game.currentPlayer = 1;
        game.nextBoard = -1;
        const message = JSON.stringify({
            type: 'boardReset',
            gameId,
            board: game.board.getUltimateBoardDto(),
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

