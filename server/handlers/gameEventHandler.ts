import { GameState, Player } from '../domain/GameState'; // Assuming you update GameState with validateMove
import { getHeuristicMove } from '../domain/AIPlayer'; // Your AI logic
import { sendIdentityMessage, sendErrorMessage } from '../utils/socketMessenger';
import { Move } from '../../types/game';

// This type definition assumes the Map is passed from gameSocket.ts
type GameStateManager = Map<string, GameState>; 

// --- ALL YOUR BUSINESS LOGIC FUNCTIONS GO HERE ---

// Note: We rename handleMove to processPlayerMove to handle the core logic
// and let handleAIMove call this function.

function processPlayerMove(peer: any, game: GameState, move: Move) {
    if (!move) {
        sendErrorMessage(peer, 'Invalid move');
        return;
    }

    console.log(`player move ${move.playerId} boardId ${move.boardId} index ${move.index} target ${move.target}`)
    game.board.update(move.boardId, move.index, move.target);
    console.log("board updated")
    console.log(game.board.boards[move.boardId].board)
    const hasWon = game.board.checkWin(move.target);

    // 3. Prepare next turn
    game.nextPlayer();
    game.setNextBoard(move.index);

    // 4. Send Confirmation Message (to all players)
    const message = JSON.stringify({
        type: 'moveConfirmed',
        gameId: game.gameId,
        playerId: move.playerId,
        move,
        board: game.board.getUltimateBoardDto(),
        nextBoard: game.nextBoard,
        currentPlayer: game.currentPlayer
    });
    console.log("sending player moveu")
    console.log(message)
    peer.publish(game.gameId, message);
    peer.send(message);

    if (hasWon) {
        const gameOverMessage = JSON.stringify({
            type: 'gameOver',
            gameId: game.gameId,
            winner: move.target,
            board: game.board.getUltimateBoardDto(),
        });
        peer.publish(game.gameId, gameOverMessage);
    }
}

export function handleReset(peer: any, data: any, gameStateManager : GameStateManager) {
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
        sendErrorMessage(peer, `Game ${gameId} not found`);
    }
}

export function handleJoin(peer: any, data: any, gameStateManager: GameStateManager) {

    console.log('Joining game ' + data.gameId);
    const gameId = data.gameId;
    const playerName = data.playerName;

    const game = gameStateManager.get(gameId);
    console.log(game)
    if (game) {
        let player : Player;
        try {
            player = game.findOrCreatePlayerByName(playerName);
        } catch (error) {
            const msg = `Player ${playerName} already exists.`;
            sendErrorMessage(peer, msg);
            return;
        }
        console.log(player)

        peer.subscribe(gameId);

        // Send identity to the joining player

        sendIdentityMessage(peer, player.id, gameId, playerName);
        console.log("sent Identity")

        const message = JSON.stringify({
            type: 'playerJoined',
            gameId,
            playerName,
            board: game.board.getUltimateBoardDto(),
            currentPlayer: game.currentPlayer,
            nextBoard: game.nextBoard
        });
        console.log("sent player joined")
        peer.publish(gameId, message);
        peer.send(message);
    } else {
        // Handle error or create? For now just log
        console.log(`Game ${gameId} not found`);
        sendErrorMessage(peer, `Game ${gameId} not found`);
    }
}

export function handleCreate(peer: any, data: any, gameStateManager : GameStateManager) {
    if (gameStateManager.has(data.gameId)) {
        sendErrorMessage(peer, `Game ${data.gameId} already exists`);
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



export function handleMove(peer: any, data: any, stateManager: GameStateManager) {
    const move = data.move;
    const gameId = move.gameId;
    const game = stateManager.get(gameId);
    
    if (!game) {
        sendErrorMessage(peer, `Game ${gameId} not found`);
        return;
    }

    try {
        processPlayerMove(peer, game, move);
    } catch (e) {
        console.error('Move failed:', e);
        // sendErrorMessage(peer, e.message); // Should send only to the player who made the invalid move
    }
}

// ... other exported handler functions (handleJoin, handleCreate, handleReset) ...

// Example of exporting handleAIMove
export function handleAIMove(peer: any, data: any, stateManager: GameStateManager) {
    console.log('====================')
    console.log("Handle Ai Move");
    console.log('====================')
    const move = data.move;
    const gameId = move.gameId;
    const game = stateManager.get(gameId);

    if (!game) {
        sendErrorMessage(peer, `Game ${gameId} not found`);
        return;
    }
    
    console.log("got game with board");
    console.log(game.board)

    const opponent = move.playerId === 1 ? 2 : 1;
    
    // 1. Process the HUMAN player's move first
    try {
        processPlayerMove(peer, game, move);
    } catch (e) {
        console.error('Human move failed in AI handler:', e);
        return;
    }
    
    // Check if the human move ended the game
    if (game.board.winner !== 0) {
        return; 
    }

    // 2. Get AI move
    console.log("get aiMove");
    // console.log("game board")
    // console.log(game.board)
    const aimove: Move = getHeuristicMove(gameId, game.board, game.nextBoard, opponent);
    console.log("ai move");
    console.log(aimove)

    if (aimove) {
        const aiMoveData = {
            gameId: gameId,
            boardId: aimove.boardId,
            index: aimove.index,
            target: opponent,
            playerId: opponent,
        };
        
        // 3. Process the AI player's move
        try {
            console.log("process ai move");
            processPlayerMove(peer, game, aiMoveData);
        } catch (e) {
            console.error('AI move failed:', e);
        }
    }
}