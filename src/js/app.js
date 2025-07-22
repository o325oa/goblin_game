import '../css/style.css';
import gnomeImage from '../img/goblin.png';

class Game {
  constructor() {
    this.boardSize = 4;
    this.currentPosition = null;
    this.gnomeElement = null;
    this.intervalId = null;
    this.init();
  }

  init() {
    this.createGameBoard();
    this.createGnome();
    this.startMoving();
  }

  createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let i = 0; i < this.boardSize * this.boardSize; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      gameBoard.appendChild(cell);
    }
  }

  createGnome() {
    this.gnomeElement = document.createElement('img');
    this.gnomeElement.src = gnomeImage;
    this.gnomeElement.className = 'gnome';
    this.moveToRandomCell();
  }

  moveToRandomCell() {
    const cells = document.querySelectorAll('.cell');
    const newPosition = Math.floor(Math.random() * cells.length);

    if (newPosition === this.currentPosition && cells.length > 1) {
      this.moveToRandomCell();
      return;
    }

    if (this.currentPosition !== null) {
      cells[this.currentPosition].innerHTML = '';
    }

    cells[newPosition].appendChild(this.gnomeElement);
    this.currentPosition = newPosition;
  }

  startMoving() {
    this.intervalId = setInterval(() => {
      this.moveToRandomCell();
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});