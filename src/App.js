import { Client } from "boardgame.io/client";
import { Local } from "boardgame.io/multiplayer";
import { MCTSBot } from "boardgame.io/ai";
import { TicTacToe } from "./Game";

const isDev = () => false;

const config = {
  game: TicTacToe,
  debug: isDev(),
  playerID: "0",
  matchID: Math.floor(Math.random() * 10000),
  multiplayer: Local({
    bots: {
      1: MCTSBot,
    },
  }),
};

class TicTacToeClient {
  constructor(rootElement) {
    rootElement.innerHTML = "";
    this.client = Client(config);
    this.client.start();
    this.rootElement = rootElement;
    this.createHeader();
    this.createBoard();
    this.attachListeners();
    this.client.subscribe((state) => this.update(state));
  }
  createHeader() {
    this.rootElement.insertAdjacentHTML(
      "beforeEnd",
      `
      <div class="header">
        <div class="score"> <strong></strong></div>
        <button class="replay">Replay</button>
      </header>      
    `
    );
  }
  createBoard() {
    const cells = [];
    for (let i = 0; i < 9; i++) {
      cells.push(`<div class="cell" data-id="${i}"></div>`);
    }

    // Add the HTML to our app <div>.
    // We’ll use the empty <p> to display the game winner later.
    this.rootElement.insertAdjacentHTML(
      "beforeEnd",
      `
      <div class="container">${cells.join("")}</div>      
    `
    );
  }

  attachListeners() {
    // This event handler will read the cell id from a cell’s
    // `data-id` attribute and make the `clickCell` move.
    const handleCellClick = (event) => {
      const id = parseInt(event.target.dataset.id);
      this.client.moves.clickCell(id);
    };
    // Attach the event listener to each of the board cells.
    const cells = this.rootElement.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.onclick = handleCellClick;
    });

    this.rootElement.querySelector(".replay").onclick = () => {
      window.location.reload();
    };
  }
  update(state) {
    // Get all the board cells.
    const cells = this.rootElement.querySelectorAll(".cell");
    // Update cells to display the values in game state.
    cells.forEach((cell) => {
      const cellId = parseInt(cell.dataset.id);
      const cellValue = state.G.cells[cellId];
      cell.textContent = cellValue !== null ? cellValue : "";
    });
    // Get the gameover message element.
    const messageEl = this.rootElement.querySelector(".score strong");
    // Update the element to show a winner if any.
    if (state.ctx.gameover) {
      messageEl.textContent =
        state.ctx.gameover.winner !== undefined
          ? "Winner is: " + state.ctx.gameover.winner
          : "Draw!";
      state.ctx.gameover?.cells.forEach((id) =>
        this.rootElement
          .querySelector(`[data-id='${id}']`)
          .classList.add("win-cell")
      );
    } else {
      messageEl.textContent = "";
    }
  }
}

const appElement = document.getElementById("app");
const app = new TicTacToeClient(appElement);
