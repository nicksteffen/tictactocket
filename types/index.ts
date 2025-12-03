export interface smallBoardState {
    board: Number[];
    isAvailable: boolean;
    winner: number;
    maxRows: number;
    maxCols: number;
    index: number;
}

export interface boardState {
    boards: smallBoardState[];
    winner: number;
    maxRows: number;
    maxCols: number;
}
