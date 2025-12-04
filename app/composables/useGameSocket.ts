
import { useWebSocket } from "@vueuse/core";
import { toast } from "vue-sonner";

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
            toast.error(message.message);
        }
        if (message.type === 'moveConfirmed') {
            gameStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
        }
        if (message.type === 'boardReset') {
            console.log("board reset")
            gameStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
            toast.info('Board reset');
        }
        if (message.type === 'playerJoined') {
            gameStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
            console.log(message.playerName + ' joined the game');
            toast.success(`${message.playerName} joined the game`);
        }
        if (message.type === 'playerLeft') {
            console.log(message.playerName + ' left the game');
            toast.info(`${message.playerName} left the game`);
        }
        if (message.type === 'gameStarted') {
            console.log('Game started');
            console.log(message.board)
            gameStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
            toast.success('Game started!');
        }
        if (message.type === 'identity') {
            console.log('Identity received: ' + message.playerId);
            gameStore.setPlayerToken(message.playerId);
        }
        if (message.type === 'gameOver') {
            console.log('Game over');
            const winnerName = message.winner === 1 ? 'Player 1 (X)' : 'Player 2 (O)';
            toast.success(`Game Over! ${winnerName} Wins!`);
        }

        // CREATE AND JOIN GAME SHOULD BE HANDELED AND SYNC BOARD STATE?
        // handle data
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
