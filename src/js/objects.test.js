import { Gameboard, Ship, ComputerPlayer, Player, Game } from "./objects.js";

describe("Ship Class", () => {
  const shipA = new Ship(0);
  const shipB = new Ship(-3);
  const shipC = new Ship(3);
  const shipD = new Ship(2);
  shipD.hit();
  shipD.hit();
  const shipE = new Ship(1);
  shipE.hit();
  shipE.hit(); // over-hit

  test("ship length 0 defaults to 1", () => expect(shipA.length).toBe(1));
  test("ship negative length uses Math.max", () =>
    expect(shipB.length).toBe(3));
  test("ship length 3", () => expect(shipC.length).toBe(3));
  test("ship initial hits is 0", () => expect(shipC.hits).toBe(0));
  test("ship hit increments hits", () => expect(shipD.hits).toBe(2));
  test("ship cannot be over-hit", () => expect(shipE.hits).toBe(1));
  test("ship not sunk when hits < length", () =>
    expect(shipC.isSunk()).toBe(false));
  test("ship sunk when hits === length", () =>
    expect(shipD.isSunk()).toBe(true));
  test("ship has no sunk property", () => expect(shipA.sunk).toBeUndefined());
});

describe("Gameboard Class", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  test("board initializes as 10x10 null grid", () => {
    expect(board.board.length).toBe(10);
    expect(board.board[0].length).toBe(10);
    expect(board.board[0][0]).toBeNull();
  });

  test("each row is independent", () => {
    board.board[0][0] = "test";
    expect(board.board[1][0]).toBeNull();
  });

  test("placeShip places ship instance in cells horizontally", () => {
    board.placeShip([0, 0], 3, "horizontal");
    expect(board.board[0][0]).toBeInstanceOf(Ship);
    expect(board.board[0][1]).toBeInstanceOf(Ship);
    expect(board.board[0][2]).toBeInstanceOf(Ship);
  });

  test("placeShip places ship instance in cells vertically", () => {
    board.placeShip([0, 0], 3, "vertical");
    expect(board.board[0][0]).toBeInstanceOf(Ship);
    expect(board.board[1][0]).toBeInstanceOf(Ship);
    expect(board.board[2][0]).toBeInstanceOf(Ship);
  });

  test("placeShip returns false when out of bounds", () => {
    expect(board.placeShip([8, 0], 3, "horizontal")).toBe(false);
  });

  test("placeShip returns false when cell occupied", () => {
    board.placeShip([0, 0], 2, "horizontal");
    expect(board.placeShip([0, 0], 2, "horizontal")).toBe(false);
  });

  test("placeShip returns false when cell is buffer", () => {
    board.placeShip([2, 2], 2, "horizontal");
    expect(board.placeShip([4, 1], 1, "horizontal")).toBe(false);
  });

  test("placeShip marks buffer zones around ship", () => {
    board.placeShip([2, 2], 1, "horizontal");
    expect(board.board[1][1]).toBe("buffer");
    expect(board.board[3][3]).toBe("buffer");
  });

  test("placeShip adds ship to ships array", () => {
    board.placeShip([0, 0], 3, "horizontal");
    expect(board.ships.length).toBe(1);
  });

  test("receiveAttack registers miss", () => {
    board.receiveAttack([0, 0]);
    expect(board.board[0][0]).toBe("miss");
  });

  test("receiveAttack registers hit", () => {
    board.placeShip([0, 0], 3, "horizontal");
    board.receiveAttack([0, 0]);
    expect(board.board[0][0]).toBeInstanceOf(Ship);
    expect(board.board[0][0].hits).toBe(1);
  });

  test("receiveAttack returns true on hit", () => {
    board.placeShip([0, 0], 3, "horizontal");
    expect(board.receiveAttack([0, 0])).toBe(true);
  });

  test("receiveAttack returns false on miss", () => {
    expect(board.receiveAttack([0, 0])).toBe(false);
  });

  test("receiveAttack returns sunk when ship sunk", () => {
    board.placeShip([0, 0], 1, "horizontal");
    expect(board.receiveAttack([0, 0])).toBe("sunk");
  });

  test("receiveAttack ignores duplicate attack", () => {
    board.receiveAttack([0, 0]);
    expect(board.receiveAttack([0, 0])).toBeUndefined();
  });

  test("attackedCoords tracks attacked cells", () => {
    board.receiveAttack([3, 4]);
    expect(board.attackedCoords.has("3,4")).toBe(true);
  });

  test("isAllSunk returns false when ships remain", () => {
    board.placeShip([0, 0], 2, "horizontal");
    board.receiveAttack([0, 0]);
    expect(board.isAllSunk()).toBe(false);
  });

  test("isAllSunk returns true when all ships sunk", () => {
    board.placeShip([0, 0], 1, "horizontal");
    board.receiveAttack([0, 0]);
    expect(board.isAllSunk()).toBe(true);
  });
});

describe("Player Class", () => {
  let player;
  beforeEach(() => {
    player = new Player();
  });

  test("player has a gameboard", () => {
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test("attack registers on enemy board", () => {
    const enemy = new Player();
    player.attack([0, 0], enemy.gameboard);
    expect(enemy.gameboard.attackedCoords.has("0,0")).toBe(true);
  });

  test("attack returns false on miss", () => {
    const enemy = new Player();
    expect(player.attack([0, 0], enemy.gameboard)).toBe(false);
  });

  test("attack returns true on hit", () => {
    const enemy = new Player();
    enemy.gameboard.placeShip([0, 0], 3, "horizontal");
    expect(player.attack([0, 0], enemy.gameboard)).toBe(true);
  });
});

describe("ComputerPlayer Class", () => {
  let computer;
  beforeEach(() => {
    computer = new ComputerPlayer();
  });

  test("computer has a gameboard", () => {
    expect(computer.gameboard).toBeInstanceOf(Gameboard);
  });

  test("computer attack never repeats coordinates", () => {
    const enemy = new Player();
    for (let i = 0; i < 20; i++) computer.attack(enemy.gameboard);
    expect(enemy.gameboard.attackedCoords.size).toBe(20);
  });

  test("computer places all ships", () => {
    computer.randomPlaceShips();
    expect(computer.gameboard.ships.length).toBe(5);
  });

  test("computer ships have correct lengths", () => {
    computer.randomPlaceShips();
    const lengths = computer.gameboard.ships.map((s) => s.length).sort();
    expect(lengths).toEqual([2, 3, 3, 4, 5]);
  });
});

describe("Game Class", () => {
  let game;
  beforeEach(() => {
    game = new Game("player");
    game.start();
  });

  test("game initializes with player and computer", () => {
    expect(game.player).toBeInstanceOf(Player);
    expect(game.computer).toBeInstanceOf(ComputerPlayer);
  });

  test("game starts with player turn", () => {
    expect(game.playerTurn).toBe(true);
  });

  test("start places computer ships", () => {
    expect(game.computer.gameboard.ships.length).toBe(5);
  });

  test("playTurn switches turn", () => {
    game.playTurn([0, 0]);
    expect(game.playerTurn).toBe(false);
  });

  test("playTurn returns hit result", () => {
    const result = game.playTurn([0, 0]);
    expect([true, false, "sunk"]).toContain(result.hit);
  });

  test("playTurn returns attackedCoord", () => {
    const result = game.playTurn([0, 0]);
    expect(result.attackedCoord).toEqual([0, 0]);
  });

  test("playTurn returns winner when all ships sunk", () => {
    game.player.gameboard.placeShip([0, 0], 1, "horizontal");
    game.playerTurn = false;
    jest.spyOn(game.computer, "attack").mockReturnValue("sunk");
    jest.spyOn(game.player.gameboard, "isAllSunk").mockReturnValue(true);
    const result = game.playTurn();
    expect(result.winner).toBe("computer");
  });

  test("playTurn returns null winner when game ongoing", () => {
    const result = game.playTurn([0, 0]);
    expect(result.winner).toBeNull();
  });
});
