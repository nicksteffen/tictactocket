
import { useWebSocket } from "@vueuse/core";
import { toast } from "vue-sonner";
import {AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction} from "../components/ui/alert-dialog";
import type { Alert } from "~~/types/game";

type GameId = string;
type PlayerName = string;
type BoardId = number;
type Index = number;
type Target = number;
type PlayerId = number;


interface GameSocketAPI {
    requestReset: (gameId: GameId) => void;
    requestMove: (
        gameId: GameId,
        boardId: BoardId,
        index: Index,
        target: Target,
        playerId: PlayerId
    ) => void;
    requestJoinGame: (gameId: GameId, playerName: PlayerName) => void;
    requestCreateGame: (gameId: GameId, playerName: PlayerName) => void;
}
type GameSocketInstance = ReturnType<typeof useWebSocket> & GameSocketAPI;


let instance: GameSocketInstance | null = null;

export function useGameSocket() {
    const url = 'ws://localhost:3000/api/gameSocket';
    console.log("useGameSocket");
    if (instance) {
        console.log("instance already exists");
        return instance;
    }
    const socket = useWebSocket(url);
    const { status, data, send, open, close, ws } = socket;

    const gameStore = useGameStore();

    watch(data, (newData) => {
        const message = JSON.parse(newData);
        if (message.type === 'error') {
            console.log("error received");
            console.log(message.message);
            const alert: Alert = {
                type: 'error',
                message: message.message,
                details: message.details
            };
            gameStore.addAlert(alert);
        }
        if (message.type === 'moveConfirmed') {
            gameStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
        }
        if (message.type === 'boardReset') {
            console.log("board reset")
            gameStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
            toast.info('Board reset');
            gameStore.addAlert({
                type: 'info',
                message: 'Board reset',
                details: 'The board has been reset'
            });
        }
        if (message.type === 'playerJoined') {
            gameStore.joinGame(message.gameId, message.playerName, message.board);
            console.log(message.playerName + ' joined the game');
            gameStore.addAlert({
                type: 'success',
                message: `${message.playerName} joined the game`,
                details: `${message.playerName} joined the game`
            });
        }
        if (message.type === 'playerLeft') {
            console.log(message.playerName + ' left the game');
            gameStore.addAlert({
                type: 'info',
                message: `${message.playerName} left the game`,
            });
        }
        if (message.type === 'gameStarted') {
            console.log('Game started');
            console.log(message.board)
            gameStore.createGame(message.gameId, message.playerName, message.board);
            gameStore.addAlert({
                type: 'success',
                message: 'Game started!',
            });
        }
        if (message.type === 'identity') {
            console.log('Identity received: ' + message.playerId);
            gameStore.setPlayerToken(message.playerId);
        }
        if (message.type === 'gameOver') {
            console.log('Game over');
            const winnerName = message.winner === 1 ? 'Player 1 (X)' : 'Player 2 (O)';
            gameStore.addAlert({
                type: 'success',
                message: `Game Over! ${winnerName} Wins!`,
            });
        }

    });



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

    function requestJoinGame(gameId: string, playerName: string) {
        send(JSON.stringify({ type: 'join', gameId: gameId, playerName: playerName }));
    }

    function requestCreateGame(gameId: string, playerName: string) {
        send(JSON.stringify({ type: 'create', gameId: gameId, playerName: playerName }));

    }

    function requestReset(gameId: string) {
        // the server should maybe check for host/ownership or something
        const payload = {
            type: 'reset',
            gameId: gameId,
        };
        send(JSON.stringify(payload));
    }
    instance = {
        ...socket,
        requestReset,
        requestMove,
        requestJoinGame,
        requestCreateGame
    }



    return instance;

}
