import { defineStore } from 'pinia';


import type { boardState, smallBoardState } from '../../types/index';


const { data, send } = useWebSocket('ws://localhost:3000/api/gameSocket');
function requestMove(gameId: string, boardId: number, index: number, target: number, playerId: number) {
    const move = {
        gameId: gameId,
        boardId: boardId,
        index: index,
        target: target,
        playerId: playerId,
    };
    const payload = {
        type: 'move',
        move: move,
    };
    send(JSON.stringify(payload));

}
function requestReset(gameId: string) {
    // the server should maybe check for host/ownership or something
    const payload = {
        type: 'reset',
        gameId: gameId,
    };
    send(JSON.stringify(payload));

}


export const useBoardStore = defineStore('board', {
    state: () => ({
        boardState: {} as boardState,
        currentPlayer: 1,
        nextBoard: -1,
        gameId: '',
        playerName:'',
        playerId: 1,
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
        syncBoardState(boardState: boardState, nextBoard: number, currentPlayer: number) {
            // todo, I think this should be called sync Game State
            console.log("sync in actions")
            this.boardState = boardState;
            this.nextBoard = nextBoard;
            this.currentPlayer = currentPlayer;
        },
        reset() {
            requestReset(this.gameId);
        },
       
        makeMove(gameId: string, boardId: number, index: number, target: number) {
            if (this.currentPlayer !== this.playerId) {
                console.log("Not your turn");
                return;
            }
            requestMove(gameId, boardId, index, target, this.currentPlayer);


        }
    }
})

