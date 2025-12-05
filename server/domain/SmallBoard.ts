import { checkIfWon } from "../../utils/winning"
import type { SmallBoardDto } from "../../types/game"

export class SmallBoard {
    board: number[]
    isAvailable: boolean
    winner: number
    index: number
    maxRows: number
    maxCols: number

    constructor(index: number) {
        this.board = Array.from({ length: 9 }, () => 0);
        this.isAvailable = true;
        this.winner = 0;
        this.index = index;
        this.maxRows = 3;
        this.maxCols = 3;
    }
    checkWin(target: number) {
        console.log("small board check win")
        // if (this.board.every((index) => this.board[index] === target)) {
        if (checkIfWon(this.board, target)) {
            console.log("small board won")
            this.winner = target;
            this.isAvailable = false;
        }
        return this.winner;
    }
    checkDraw() {
        if (this.board.every((index) => this.board[index] !== 0)) {
            this.isAvailable = false;
        }
        return this.isAvailable;
    }
    update(index: number, target: number) {
        console.log("in SmallBoard class, small board update method")
        this.board[index] = target;
        const winner = this.checkWin(target);
        if (!winner) {
            this.checkDraw();
        }

    }

    validateMove(index: number, target: number) {
        if (!this.isAvailable) {
            throw new Error('Invalid move: This board is not available for play.');
        }
        console.log("small board validate move")
        console.log(this.board[index])
        if (this.board[index] !== 0) {
            throw new Error('Invalid move: Cell is already occupied.');
        }
    }

    getSmallBoardDto(): SmallBoardDto {
        return {
            board: this.board,
            isAvailable: this.isAvailable,
            winner: this.winner,
            index: this.index,
        };
    }
    

}