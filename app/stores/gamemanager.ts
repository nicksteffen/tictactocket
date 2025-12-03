import type { UseWebSocketReturn } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { UltimateBoardDto } from '~~/types/game';


export interface gameState {
    gameId: string;
    playerName: string;
    board: UltimateBoardDto;

}



export const useGameStore = defineStore('game', {
    state: () => ({
        // game: null as gameState | null,
        gameId: '',
        currentPlayer: 1,
        nextBoard: -1,
        playerName: '',
        playerId: 1,
        boardState: {} as UltimateBoardDto,
        // boardState: useBoardStore().boardState,

    }),
    actions: {

        setGameId(gameId: string) {
            this.gameId = gameId;
        },
        setPlayerName(playerName: string) {
            this.playerName = playerName;
        },
        setPlayerId(playerId: number) {
            this.playerId = playerId;
        },
        setPlayerToken(token: number) {
            this.playerId = token;
        },

        syncBoardState(boardState: UltimateBoardDto, nextBoard: number, currentPlayer: number) {
            this.boardState = boardState;
            // useBoardStore().setBoardState(boardState);
            this.nextBoard = nextBoard;
            this.currentPlayer = currentPlayer;
        },
        createGame(gameId: string, playerName: string) {
            this.gameId = gameId;
            this.playerName = playerName;
            this.boardState = {} as UltimateBoardDto;
        },
        joinGame(gameId: string, playerName: string) {
            this.gameId = gameId;
            this.playerName = playerName;
            this.boardState = {} as UltimateBoardDto;
        }
    }
})
