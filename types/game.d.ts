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
