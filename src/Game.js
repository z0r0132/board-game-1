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
  G.cells[id] = ctx.currentPlayer;
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

export const TicTacToe = {
  setup,
  moves,
  turn,
};
