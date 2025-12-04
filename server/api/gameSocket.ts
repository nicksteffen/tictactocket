import { GameState, Player } from '../domain/GameState';
import { UltimateBoard } from '../domain/UltimateBoard';

const gameStateManager = new Map<string, GameState>();

function sendIdentityMessage(peer: any, playerId: number, gameId: string, playerName: string) {
    const identityMessage = JSON.stringify({
        type: 'identity',
        playerId,
        gameId,
        playerName
    });
    peer.send(identityMessage);

}

function validateMove(game: GameState, index: number, boardId: number, playerId: number) {
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

    const game = gameStateManager.get(gameId);
    console.log(game)
    if (game) {
        const player = game.findOrCreatePlayerByName(playerName);
        if (!player) {
            console.log(`Player ${playerName} not found`);
            return;
        }

        peer.subscribe(gameId);

        // Send identity to the joining player

        sendIdentityMessage(peer, player.id, gameId, playerName);

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
        const message = JSON.stringify({ type: 'error', message: 'Game not found' });
        peer.send(message);
    }
}

function handleCreate(peer: any, data: any) {
    if (gameStateManager.has(data.gameId)) {
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

    const player = new Player(playerId, playerName, playerId);
    const newGame = new GameState(gameId, player, playerId);
    gameStateManager.set(gameId, newGame);
    peer.subscribe(gameId);

    sendIdentityMessage(peer, playerId, gameId, playerName);

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
    const game = gameStateManager.get(gameId);
    if (game && game.board) {
        try {
            validateMove(game, move.index, move.boardId, move.playerId);
        } catch (e) {
            console.log(e);
            return;
        }

        game.board.update(move.boardId, move.index, move.target);
        console.log(game.board)

        const hasWon = game.board.checkWin(move.target);

        game.nextPlayer();
        game.setNextBoard(move.index);

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

        if (hasWon) {
            const gameOverMessage = JSON.stringify({
                type: 'gameOver',
                gameId,
                winner: move.target,
                board: game.board.getUltimateBoardDto(),
            });
            peer.publish(gameId, gameOverMessage);
            peer.send(gameOverMessage);
        }
    } else {
        // Handle error or create? For now just log
        console.log(`Game ${gameId} not found`);
    }
}

function handleReset(peer: any, data: any) {
    const gameId = data.gameId;
    const game = gameStateManager.get(gameId);
    if (game) {
        game.reset();
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

