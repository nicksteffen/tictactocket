
import { SmallBoard } from "./SmallBoard";


jest.mock('../../utils/winning', () => ({
  checkIfWon: jest.fn((board, target) => true),
}));

import { checkIfWon } from '../../utils/winning'; 


describe('SmallBoard', () => {
    let smallBoard: SmallBoard;

    beforeEach(() => {
        // Reset mock calls/implementation before each test
        (checkIfWon as jest.Mock).mockClear();
        (checkIfWon as jest.Mock).mockImplementation((board, target) => true);
        
        smallBoard = new SmallBoard(0); 
    });

    it('should set winner and update availability if a win condition is met', () => {
        const targetPlayer = 1;
        const result = smallBoard.checkWin(targetPlayer);

        expect(checkIfWon).toHaveBeenCalledTimes(1);
        expect(checkIfWon).toHaveBeenCalledWith(smallBoard.board, targetPlayer); 
        
        expect(smallBoard.winner).toBe(targetPlayer);
        expect(smallBoard.isAvailable).toBe(false);
        expect(result).toBe(targetPlayer); 
    });

    it('should NOT set winner if no win condition is met', () => {
        (checkIfWon as jest.Mock).mockImplementationOnce((board, target) => false);

        const targetPlayer = 2;
        smallBoard.checkWin(targetPlayer);

        expect(checkIfWon).toHaveBeenCalledTimes(1);
        expect(smallBoard.winner).toBe(0); 
        expect(smallBoard.isAvailable).toBe(true); 
    });

    it('should return draw if the board is filled', () => {
        smallBoard.board = [1, 2, 1, 2, 1, 2, 1, 2, 1];
        const result = smallBoard.checkDraw();

        expect(smallBoard.isAvailable).toBe(false);
        expect(result).toBe(false);
    });

    it('should update the cell, call checkWin, and call checkDraw', () => {
        const targetPlayer = 1;
        const index = 4; // Use center cell for a non-winning scenario

        const checkWinSpy = jest.spyOn(smallBoard, 'checkWin').mockReturnValue(0); // Mock return value to simulate NO win
        const checkDrawSpy = jest.spyOn(smallBoard, 'checkDraw').mockReturnValue(false);

        smallBoard.update(index, targetPlayer);

        expect(smallBoard.board[index]).toBe(targetPlayer);
        expect(checkWinSpy).toHaveBeenCalledTimes(1);
        expect(checkWinSpy).toHaveBeenCalledWith(targetPlayer);
        expect(checkDrawSpy).toHaveBeenCalledTimes(1);

        checkWinSpy.mockRestore();
        checkDrawSpy.mockRestore();
    });
    
    it('should NOT call checkDraw if checkWin returns a winner', () => {
        const targetPlayer = 2;
        const index = 1;

        const checkWinSpy = jest.spyOn(smallBoard, 'checkWin').mockReturnValue(targetPlayer);
        const checkDrawSpy = jest.spyOn(smallBoard, 'checkDraw').mockReturnValue(false);

        smallBoard.update(index, targetPlayer);

        expect(smallBoard.board[index]).toBe(targetPlayer);
        expect(checkWinSpy).toHaveBeenCalledTimes(1);
        expect(checkDrawSpy).not.toHaveBeenCalled();

        checkWinSpy.mockRestore();
        checkDrawSpy.mockRestore();
    });
    it('should throw error if board is not available',  () => {
        const targetPlayer = 2;
        const index = 1;

        smallBoard.isAvailable = false;

        expect(() => smallBoard.validateMove(index, targetPlayer)).toThrow('Invalid move: This board is not available for play.');
    });
    it('should throw error if cell is already occupied', () => {
        const targetPlayer = 2;
        const index = 1;

        smallBoard.isAvailable = true;
        smallBoard.board[index] = 1;

        expect(() => smallBoard.validateMove(index, targetPlayer)).toThrow('Invalid move: Cell is already occupied.');
    });
    it('should not error if the move is valid', () => {
        const targetPlayer = 2;
        const index = 1;
        smallBoard.isAvailable = true;
        smallBoard.board[index] = 0;

        expect(() => smallBoard.validateMove(index, targetPlayer)).not.toThrow();
    });
    it('should return the SmallBoardDto', () => {
        const dto = smallBoard.getSmallBoardDto();
        expect(dto).toEqual({
            board: smallBoard.board,
            isAvailable: smallBoard.isAvailable,
            winner: smallBoard.winner,
            index: smallBoard.index,
        });
    });

});