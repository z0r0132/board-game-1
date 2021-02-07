import { INVALID_MOVE } from "boardgame.io/core";

/**
 * Setup function to set the initial value of the game state G
 *
 * @param {Object} ctx
 * @returns { Object } initial game state G
 */
const setup = (ctx) => {
  const cells = Array(9).fill(null);
  return { cells };
};
const SIGN = ["X", "O"];
const getPlayerSign = (player) => SIGN[player];

/**
 * ClickCell is the ine of the function move
 * It mutates the state but without return, so Immer will make
 * sure to keep it immutable
 *
 * @param {Object} G
 * @param {Object} ctx
 * @param {Int } id
 */
const clickCell = (G, ctx, id) => {
  if (G.cells[id] !== null) {
    return INVALID_MOVE;
  }
  G.cells[id] = getPlayerSign(ctx.currentPlayer);
};

/**
 * The moves object needed in boardgame.io
 */
const moves = {
  clickCell,
};

/**
 * the turn configuration passing moveLimit to control turns
 */
const turn = {
  moveLimit: 1,
};

/**
 * IsDraw function check if all cells are filled
 * which means that there is draw
 * @param {array} cells of cells
 * @returns {Boolean}  return true if all cells are filled
 */
const isDraw = (cells) => cells.filter((c) => c === null).length === 0;

/**
 * IsVictory function check if any completed state if filled
 * @param {array} cells of cells
 * @returns {Boolean}  return if there is a victory
 */
function isVictory(cells) {
  // winning rows, cols or diagonals
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // check if a complete (col, row, diagonal) is solved
  // by checking if all cells has symbol similar to first and all are not null
  const isRowComplete = (row) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  // return tre if at least one isRowComplete check of a position in positions is true
  return positions.find(isRowComplete);
}
/**
 * EndIf the game end conditions
 * @param {Object} G
 * @param {Object} ctx
 * @returns {Object} null if not finished or Object describing draw or win
 */
const endIf = (G, ctx) => {
  const cells = G.cells;
  if (isVictory(cells) !== undefined) {
    console.log(isVictory(cells));
    return {
      winner: getPlayerSign(ctx.currentPlayer),
      cells: isVictory(cells),
    };
  }
  if (isDraw(cells)) {
    return { draw: true };
  }
};

export const TicTacToe = {
  setup,
  moves,
  turn,
  endIf,
};
