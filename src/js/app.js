import '../css/styles.css';
import goblinImage from '../img/goblin.png';
import hammerImage from '../img/hammer.png';

class GameBoard {
  constructor(size) {
    this.size = size;
    this.board = document.getElementById('gameBoard');
    this.cells = [];
    this.createBoard();
  }

  createBoard() {
    this.board.style.gridTemplateColumns = `repeat(${this.size}, 100px)`;
    this.board.style.gridTemplateRows = `repeat(${this.size}, 100px)`;

    for (let i = 0; i < this.size * this.size; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      this.cells.push(cell);
      this.board.appendChild(cell);
    }
  }

  getRandomCell() {
    const randomIndex = Math.floor(Math.random() * this.cells.length);
    return this.cells[randomIndex];
  }
}

class Goblin {
  constructor() {
    this.element = document.createElement('img');
    this.element.src = goblinImage;
    this.element.className = 'goblin';
    this.currentCell = null;
  }

  showInCell(cell) {
    this.hide();
    this.currentCell = cell;
    cell.appendChild(this.element);
  }

  hide() {
    if (this.currentCell && this.currentCell.contains(this.element)) {
      this.currentCell.removeChild(this.element);
    }
  }
}

class Game {
  constructor() {
    this.board = new GameBoard(4);
    this.goblin = new Goblin();
    this.score = 0;
    this.misses = 0;
    this.interval = null;
    this.isGameActive = false;

    this.scoreElement = document.getElementById('score');
    this.missesElement = document.getElementById('misses');

    this.setupHammerCursor();
    this.setupCellClick();
    this.startGame();
  }

  setupHammerCursor() {
    this.board.cells.forEach(cell => {
    cell.style.cursor = `url(${hammerImage}) 15 15, pointer`;
    });
  }

  setupCellClick() {
    this.board.cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (!this.isGameActive) return;
        
        if (cell.contains(this.goblin.element)) {
          this.increaseScore();
          this.goblin.hide();
        }
      });
    });
  }

  increaseScore() {
    this.score++;
    this.scoreElement.textContent = this.score;
  }

  increaseMisses() {
    this.misses++;
    this.missesElement.textContent = this.misses;

    if (this.misses >= 5) {
      this.endGame();
    }
  }

  startGame() {
    this.isGameActive = true;
    this.interval = setInterval(() => {
      const randomCell = this.board.getRandomCell();
      this.goblin.showInCell(randomCell);

      setTimeout(() => {
        if (randomCell.contains(this.goblin.element)) {
          this.increaseMisses();
          this.goblin.hide();
        }
      }, 1000);
    }, 1500);
  }

  endGame() {
    clearInterval(this.interval);
    this.isGameActive = false;
    alert(`Игра окончена! Ваш счёт: ${this.score}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});