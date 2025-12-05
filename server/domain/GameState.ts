import { UltimateBoard } from "./UltimateBoard";


export class Player {
    id: number;
    name: string;
    token: number;
    constructor(id: number, name: string, token: number) {
        this.id = id;
        this.name = name;
        this.token = token;
    }
}

export class GameState {
    gameId: string;
    players: Map<number, Player>;
    board: UltimateBoard;
    currentPlayer: number;
    nextBoard: number;
    
    constructor(gameId: string, player: Player, currentPlayer: number) {
        // maybe we default the current player as well?
        this.gameId = gameId;
        this.players = new Map<number, Player>();
        this.players.set(player.token, player)
        this.board = new UltimateBoard();
        this.currentPlayer = currentPlayer;
        this.nextBoard = -1;
    }

    reset() {
        this.board = new UltimateBoard();
        this.currentPlayer = 1;
        this.nextBoard = -1;
    }

    nextPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }
    setNextBoard(index: number) {
        this.nextBoard = this.board.getNextBoard(index);
    }
    findPlayer(token: number): Player {
        return this.players.get(token) as Player;
    }
    addPlayer(player: Player) {
        this.players.set(player.token, player);
    }
    findOrCreatePlayerByName(name: string): Player {
        let playerId = 0;
        // Check for reconnection
        for (const token of this.players.keys()) {
            const player = this.players.get(token)
            if (player && player.name === name) {
                playerId = player.id;
                break;
            }
        }
        if (playerId !== 0) {
            return this.findPlayer(playerId) as Player;
        }

        // If not reconnecting, assign new token
        if (playerId === 0) {
            if (!this.players.has(1)) {
                playerId = 1;
            } else if (!this.players.has(2)) {
                playerId = 2;
            } else {
                // Game full
                throw new Error('Game is full');
            }
        }

        const player = new Player(playerId, name, playerId);
        this.addPlayer(player);
        return player;
    }

}