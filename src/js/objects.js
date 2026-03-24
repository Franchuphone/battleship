export class Ship {
  constructor(length) {
    this.length = Math.max(1, Math.abs(length));
    this.hits = 0;
  }

  hit() {
    if (this.hits < this.length) this.hits += 1;
  }

  isSunk() {
    return this.hits === this.length;
  }
}

export class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => new Array(10).fill(null));
    this.attackedCoords = new Set();
    this.ships = [];
  }

  placeShip(coord, length, direction) {
    const [x, y] = coord;
    if (!this.isValidPlacement(coord, length, direction)) return false;
    const ship = new Ship(length);
    this.ships.push(ship);
    for (let i = 0; i < length; i++) {
      const [cx, cy] = direction === "horizontal" ? [x + i, y] : [x, y + i];
      if (direction === "horizontal") this.board[y][x + i] = ship;
      else this.board[y + i][x] = ship;
      for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
          const nx = cx + dx,
            ny = cy + dy;
          if (
            nx >= 0 &&
            nx < 10 &&
            ny >= 0 &&
            ny < 10 &&
            !(this.board[ny][nx] instanceof Ship)
          )
            this.board[ny][nx] = "buffer";
        }
      }
    }
    return true;
  }

  receiveAttack(coord) {
    const [x, y] = coord,
      cell = this.board[y][x];
    if (this.attackedCoords.has(`${x},${y}`)) return;
    this.attackedCoords.add(`${x},${y}`);
    if (cell instanceof Ship) {
      cell.hit();
      if (cell.isSunk()) return "sunk";
      return true;
    } else {
      this.board[y][x] = "miss";
      return false;
    }
  }

  isAllSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  isValidPlacement(coord, length, direction) {
    const [x, y] = coord;
    if (x < 0 || y < 0) return false;
    for (let i = 0; i < length; i++) {
      const outbound = direction === "horizontal" ? x + i >= 10 : y + i >= 10;
      if (outbound) return false;
      const cell =
        direction === "horizontal"
          ? this.board[y][x + i]
          : this.board[y + i][x];
      if (cell instanceof Ship || cell === "buffer") return false;
    }
    return true;
  }

  reset() {
    this.board = Array.from({ length: 10 }, () => new Array(10).fill(null));
    this.ships = [];
    this.attackedCoords = new Set();
  }
}

export class Player {
  constructor() {
    this.gameboard = new Gameboard();
  }

  randomPlaceShips() {
    for (const shipLength of [2, 3, 3, 4, 5]) {
      let coord,
        random,
        direction = ["horizontal", "vertical"];
      do {
        coord = Array.from({ length: 2 }, () => Math.floor(Math.random() * 10));
        random = Math.floor(Math.random() * 2);
      } while (!this.gameboard.placeShip(coord, shipLength, direction[random]));
    }
  }

  attack(coord, enemyBoard) {
    return enemyBoard.receiveAttack(coord);
  }
}

export class ComputerPlayer extends Player {
  constructor() {
    super();
    this.lastAttack;
  }

  attack(enemyBoard) {
    let coord;
    do {
      coord = Array.from({ length: 2 }, () => Math.floor(Math.random() * 10));
    } while (enemyBoard.attackedCoords.has(coord.join(",")));
    this.lastAttack = coord;
    return enemyBoard.receiveAttack(coord);
  }
}

export class Game {
  constructor(name) {
    this.playerName = name;
    this.playerTurn = true;
    this.player = new Player();
    this.computer = new ComputerPlayer();
  }

  playTurn(coord) {
    let winner = null;
    const hit = this.playerTurn
      ? this.player.attack(coord, this.computer.gameboard)
      : this.computer.attack(this.player.gameboard);
    const attackedCoord = this.playerTurn ? coord : this.computer.lastAttack;
    if (hit === "sunk") {
      if (this.playerTurn && this.computer.gameboard.isAllSunk())
        winner = "player";
      if (this.player.gameboard.isAllSunk()) winner = "computer";
    }
    this.playerTurn = !this.playerTurn;
    return {
      attackedCoord,
      hit,
      winner,
    };
  }

  start() {
    this.computer.randomPlaceShips();
    this.playerTurn = true;
  }

  placePlayerShip(coord, length, direction) {
    return this.player.gameboard.placeShip(coord, length, direction);
  }
}
