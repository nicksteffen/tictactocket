import { defineStore } from 'pinia';
import type { UltimateBoardDto } from '~~/types/game';


export interface gameState {
    gameId: string;
    playerName: string;
    board: UltimateBoardDto;

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
                board: {} as UltimateBoardDto,
            };
        },
        joinGame(gameId: string, playerName: string) {
            this.game = {
                gameId: gameId,
                playerName: playerName,
                board: {} as UltimateBoardDto,
            };
        }
    }
})
