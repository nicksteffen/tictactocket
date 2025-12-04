export interface SmallBoardDto {
    board: number[];
    isAvailable: boolean;
    winner: number;
    index: number;
}
    
export interface UltimateBoardDto {
    boards: SmallBoardDto[];
    winner: number;
}

export interface GameStateDto {
    gameId: string;
    players: Player[];
    boardState: UltimateBoardDto;
    currentPlayer: number;
    nextBoard: number;
}

export interface Player {
    id: number;
    name: string;
    token: number;
}
interface Alert {
    id?: number;
    type: string;
    message: string;
    details?: string;
    timestamp?: string;
}
