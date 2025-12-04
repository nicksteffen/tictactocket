import type { UseWebSocketReturn } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Alert, UltimateBoardDto } from '~~/types/game';


export interface gameState {
    id: string;
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
        alerts: [] as Alert[],
        isAI: false,

    }),
    actions: {
        addAlert(alert: Alert) {
            alert.id = this.alerts.length;
            alert.timestamp = new Date().toISOString();
            this.alerts.push(alert);
        },
        removeFirstAlert() {
            this.alerts.shift();
        },
        removeAlert(alertId: number) {
            this.alerts = this.alerts.filter((a) => a.id !== alertId);
        },

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
        createGame(gameId: string, playerName: string, boardState: UltimateBoardDto) {
            this.gameId = gameId;
            this.playerName = playerName;
            this.boardState = boardState;
        },

        syncBoardState( boardState: UltimateBoardDto, nextBoard: number, currentPlayer: number) {
            this.boardState = boardState;
            this.nextBoard = nextBoard;
            this.currentPlayer = currentPlayer;
        },
        joinGame(gameId: string, playerName: string, boardState: UltimateBoardDto) {
            this.gameId = gameId;
            this.playerName = playerName;
            this.boardState = boardState;
        }
    }
})
