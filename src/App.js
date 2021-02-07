import { Client } from "boardgame.io/client";
import { TicTacToe } from "./Game";

const isDev = () => true;

const config = {
  game: TicTacToe,
  debug: isDev(),
};

class TicTacToeClient {
  constructor() {
    this.client = Client(config);
    this.client.start();
  }
}

const app = new TicTacToeClient();
