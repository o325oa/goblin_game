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
    this.setupCustomCursorFollower();
    this.setupCellClick();
    this.startGame();
  }

  setupHammerCursor() {
    const hammerImg = new Image();
    hammerImg.src = hammerImage;
    hammerImg.onload = () => {
      const targetSize = 32;
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const context = canvas.getContext('2d');

      const scale = Math.min(
        targetSize / hammerImg.width,
        targetSize / hammerImg.height,
        1,
      );
      const scaledWidth = Math.round(hammerImg.width * scale);
      const scaledHeight = Math.round(hammerImg.height * scale);
      const dx = Math.floor((targetSize - scaledWidth) / 2);
      const dy = Math.floor((targetSize - scaledHeight) / 2);

      context.clearRect(0, 0, targetSize, targetSize);
      context.drawImage(hammerImg, dx, dy, scaledWidth, scaledHeight);

      const cursorDataUrl = canvas.toDataURL('image/png');

      this.board.cells.forEach((cell) => {
        cell.style.cursor = `url(${cursorDataUrl}) 15 15, url(${hammerImage}) 15 15, pointer`;
        cell.querySelectorAll('*').forEach((child) => {
          child.style.cursor = 'inherit';
        });
      });
    };
  }

  setupCustomCursorFollower() {
    const cursorEl = document.createElement('img');
    cursorEl.src = hammerImage;
    cursorEl.alt = '';
    cursorEl.style.position = 'fixed';
    cursorEl.style.width = '24px';
    cursorEl.style.height = '24px';
    cursorEl.style.pointerEvents = 'none';
    cursorEl.style.zIndex = '9999';
    cursorEl.style.transform = 'translate(-10px, -10px)';
    cursorEl.style.display = 'none';
    document.body.appendChild(cursorEl);

    const show = () => {
      cursorEl.style.display = 'block';
    };
    const hide = () => {
      cursorEl.style.display = 'none';
    };

    this.board.board.addEventListener('mouseenter', show);
    this.board.board.addEventListener('mouseleave', hide);
    this.board.board.addEventListener('mousemove', (e) => {
      cursorEl.style.left = `${e.clientX}px`;
      cursorEl.style.top = `${e.clientY}px`;
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
