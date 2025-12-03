import { defineStore } from 'pinia';
import type { boardState } from '~~/types';


export interface gameState {
    gameId: string;
    playerName: string;
    board: boardState;

}

export const useGameStore = defineStore('game', {
    state: () => ({
        game: null as gameState | null,
        socket: null as WebSocket | null,
    }),
    actions: {
        connect() {
        },
        createGame(gameId: string, playerName: string) {
            this.game = {
                gameId: gameId,
                playerName: playerName,
                board: {} as boardState,
            };
        },
        joinGame(gameId: string, playerName: string) {
            this.game = {
                gameId: gameId,
                playerName: playerName,
                board: {} as boardState,
            };
        }
    }
})
