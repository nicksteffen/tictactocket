import { checkIfWon } from "~~/utils/winning";
import { SmallBoard } from "./SmallBoard";
import { UltimateBoardDto } from "~~/types/game";


export class UltimateBoard {
    boards: SmallBoard[]
    winner: number
    maxRows: number
    maxCols: number

    constructor() {
        this.boards = Array.from({ length: 9 }, (_, index: number) => new SmallBoard(index)),
        this.winner = 0;
        this.maxRows = 3;
        this.maxCols = 3;
    }

    checkWin(target: number) {
        const overallBoard = this.boards.map((board) => board.winner);
        const winner = checkIfWon(overallBoard, target);
        if (winner) {
            this.winner = target;
            return true;
        }
        return false;
    }

    update(boardId: number, index: number, target: number) {
        this.boards[boardId].update(index, target);
        return this.boards
    }
    getUltimateBoardDto(): UltimateBoardDto {
        return {
            boards: this.boards.map((board) => board.getSmallBoardDto()),
            winner: this.winner,
        };
    }
    getNextBoard(index: number) {
        const targetNextBoard = this.boards[index];
        if (targetNextBoard.isAvailable) {
            return index;
        } else {
            return -1
        }
    }
}