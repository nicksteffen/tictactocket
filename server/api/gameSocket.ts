import { getHeuristicMove } from '../domain/AIPlayer';
import { Move } from '../../types/game';
import { GameState, Player } from '../domain/GameState';
import { UltimateBoard } from '../domain/UltimateBoard';
import { handleAIMove, handleCreate, handleJoin, handleMove, handleReset } from '../handlers/gameEventHandler';

const gameStateManager = new Map<string, GameState>();

export default defineWebSocketHandler({
    open(peer) {
        console.log('WebSocket connection opened');
    },
    close(peer) {
        console.log('WebSocket connection closed');
    },
    message(peer, message) {
        const data = JSON.parse(message.text());

        if (data.type === 'join') {
            handleJoin(peer, data, gameStateManager);
        }
        if (data.type === 'create') {
            handleCreate(peer, data, gameStateManager);
        }
        if (data.type === 'move') {
            handleMove(peer, data, gameStateManager);
        }
        if (data.type === 'reset') {
            handleReset(peer, data, gameStateManager);
        }
        if (data.type === 'aiMove') {
            handleAIMove(peer, data, gameStateManager);
        }
    },
})

