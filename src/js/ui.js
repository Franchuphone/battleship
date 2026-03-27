import { setupPlayer } from "../html/setupPlayer";
import { Game, Ship } from "./objects";
import { handleStartBtn, handlePlayerAttack } from "./logic";
import { dialogBox } from "../html/dialogBox";

let dragData = {},
  playerBoard = null,
  enemyBoard = null;

export let game = new Game("Your fleet");

export function displayHeader(string = "Welcome to Battleship War !") {
  const { header } = listenElements();
  header.textContent = string;
}

export function displayInfoBar(string = "Waiting for your fleet") {
  const { infoBar } = listenElements();
  infoBar.textContent = string;
}

export function displaySetup() {
  const { leftPanel, rightPanel } = listenElements(),
    { grid, gridName } = displayGrid(game.playerName, "setup");
  rightPanel.innerHTML = "";
  rightPanel.append(gridName, grid);
  leftPanel.innerHTML = "";
  leftPanel.innerHTML = setupPlayer;
  const { clearBtn, startBtn, randomBtn, fleet, playerName } = listenElements();
  fleet.innerHTML = "";
  generateFleet();

  // Clear funtionnality
  clearBtn.addEventListener("click", () => {
    game.player.gameboard.reset();
    fleet.innerHTML = "";
    const { grid, gridName } = displayGrid(game.playerName, "setup");
    generateFleet();
    rightPanel.innerHTML = "";
    rightPanel.append(gridName, grid);
    startBtn.removeEventListener("click", handleStartBtn);
    startBtn.classList.add("inactive");
  });

  // Random functionnality
  randomBtn.addEventListener("click", () => {
    game.player.gameboard.reset();
    game.player.randomPlaceShips();
    const { grid, gridName } = displayGrid(game.playerName, "setup");
    rightPanel.innerHTML = "";
    rightPanel.append(gridName, grid);
    displayRandomGeneratedShips(grid);
    startBtn.classList.remove("inactive");
    startBtn.removeEventListener("click", handleStartBtn);
    startBtn.addEventListener("click", handleStartBtn);
    Array.from(fleet.children).forEach((ship) => ship.classList.add("placed"));
  });
}

export function displayBattle() {
  const { leftPanel, rightPanel } = listenElements(),
    restartBtn = document.createElement("button");
  document.body.append(restartBtn);
  restartBtn.id = "restart";
  restartBtn.textContent = "NEW";
  restartBtn.addEventListener("click", () => {
    game = new Game();
    displaySetup();
    restartBtn.remove();
  });
  leftPanel.innerHTML = "";
  rightPanel.innerHTML = "";
  const { grid: playerGrid, gridName: playerName } = displayGrid(
    game.playerName,
    "battle-player",
  );
  const { grid: enemyGrid, gridName: enemyName } = displayGrid(
    "Enemy's fleet",
    "battle-enemy",
  );
  displayInfoBar("Your turn to attack");
  playerBoard = playerGrid;
  enemyBoard = enemyGrid;
  playerGrid.classList.add("battle");
  leftPanel.append(playerName, playerGrid);
  rightPanel.append(enemyName, enemyGrid);
}

export function displayEndGame(winner) {
  const dialog = document.createElement("dialog");
  let dialogContent = dialogBox,
    looser = winner === "player" ? "computer" : game.playerName;
  winner = winner === "player" ? game.playerName : "computer";
  winner = winner.charAt(0).toUpperCase() + winner.slice(1);
  looser = looser.charAt(0).toUpperCase() + looser.slice(1);
  dialogContent = dialogContent
    .replace("{{winner}}", winner)
    .replace("{{looser}}", looser);
  dialog.innerHTML = dialogContent;
  document.body.append(dialog);
  dialog.showModal();
  const { newGameBtn, restartBtn } = listenElements();
  newGameBtn.addEventListener("click", () => {
    game = new Game();
    displaySetup();
    dialog.close();
    restartBtn.remove();
  });
}

export function listenElements() {
  const container = document.querySelector(".container");
  const header = document.querySelector(".header");
  const leftPanel = document.querySelector(".left-panel");
  const rightPanel = document.querySelector(".right-panel");
  const infoBar = document.querySelector(".info-text");
  const fleet = document.querySelector(".fleet");
  const clearBtn = document.querySelector("#clear");
  const startBtn = document.querySelector("#start");
  const randomBtn = document.querySelector("#random");
  const playerName = document.querySelector("#player");
  const newGameBtn = document.querySelector("#new-game");
  const restartBtn = document.querySelector("#restart");
  return {
    container,
    header,
    leftPanel,
    rightPanel,
    infoBar,
    fleet,
    clearBtn,
    startBtn,
    randomBtn,
    playerName,
    newGameBtn,
    restartBtn,
  };
}

function displayGrid(name, type) {
  const gridName = document.createElement("div"),
    grid = generateGrid(name),
    cells = grid.querySelectorAll(".cell");
  gridName.textContent = name;
  gridName.classList.add("player-name");

  if (type === "setup") {
    cells.forEach((cell) => {
      cell.addEventListener("dragover", (e) => e.preventDefault());
      cell.addEventListener("dragenter", (e) => {
        e.preventDefault();
        const x = parseInt(cell.getAttribute("x")),
          y = parseInt(cell.getAttribute("y")),
          length = parseInt(dragData.length),
          direction = dragData.direction,
          valid = game.player.gameboard.isValidPlacement(
            [x, y],
            length,
            direction,
          );
        highlightCells(grid, x, y, length, direction, valid);
      });

      cell.addEventListener("dragleave", (e) => {
        const x = parseInt(cell.getAttribute("x")),
          y = parseInt(cell.getAttribute("y")),
          length = parseInt(dragData.length),
          direction = dragData.direction;
        highlightCells(grid, x, y, length, direction);
      });

      cell.addEventListener("drop", (e) => {
        const x = parseInt(cell.getAttribute("x")),
          y = parseInt(cell.getAttribute("y")),
          length = parseInt(dragData.length),
          direction = dragData.direction,
          valid = game.placePlayerShip([x, y], length, direction);
        highlightCells(grid, x, y, length, direction, valid, "drop");
        if (valid) {
          dragData.element.classList.add("placed");
          dragData.element.classList.remove("vertical");
          dragData.element.setAttribute("draggable", false);
          dragData.element.removeEventListener(
            "contextmenu",
            dragData.handleRotation,
          );
          if (game.player.gameboard.ships.length === 5) {
            const { startBtn } = listenElements();
            startBtn.classList.remove("inactive");
            startBtn.addEventListener("click", handleStartBtn);
          }
        }
      });
    });
  }

  if (type === "battle-enemy") {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        cell.style.pointerEvents = "none";
        const x = parseInt(cell.getAttribute("x")),
          y = parseInt(cell.getAttribute("y")),
          hit = handlePlayerAttack([x, y], (computerHit, coord) => {
            const [cx, cy] = coord,
              targetCell = playerBoard.querySelector(`[x="${cx}"][y="${cy}"]`);
            displayCellHits(targetCell, computerHit, cx, cy, playerBoard);
          });
        displayCellHits(cell, hit, x, y, enemyBoard);
      });
    });
  }

  if (type === "battle-player") {
    displayRandomGeneratedShips(grid);
  }

  return { grid, gridName };
}

function generateGrid() {
  const grid = document.createElement("div");
  grid.className = `grid`;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      const front = document.createElement("div");
      const back = document.createElement("div");
      front.className = "front";
      back.className = "back";
      cell.append(front, back);
      cell.className = `cell`;
      cell.setAttribute("x", j);
      cell.setAttribute("y", i);
      grid.append(cell);
    }
  }
  return grid;
}

function generateFleet() {
  const fleetLength = [2, 3, 3, 4, 5];
  const { fleet } = listenElements();
  for (let length of fleetLength) {
    fleet.append(generateShip(length));
  }
}

function generateShip(length) {
  const ship = document.createElement("div");
  ship.className = "ship";
  ship.setAttribute("length", length);
  ship.setAttribute("direction", "horizontal");
  ship.setAttribute("draggable", true);

  function handleRotation(e) {
    e.preventDefault();
    ship.getAttribute("direction") === "horizontal"
      ? ship.setAttribute("direction", "vertical")
      : ship.setAttribute("direction", "horizontal");
    ship.classList.toggle("vertical");
  }

  ship.addEventListener("contextmenu", handleRotation);
  ship.addEventListener("dragstart", (e) => {
    dragData.length = ship.getAttribute("length");
    dragData.direction = ship.getAttribute("direction");
    dragData.element = ship;
    dragData.handleRotation = handleRotation;
  });

  for (let i = 0; i < length; i++) {
    const shipCell = document.createElement("div");
    ship.append(shipCell);
  }
  return ship;
}

function highlightCells(
  grid,
  x,
  y,
  length,
  direction,
  valid = null,
  state = null,
) {
  for (let i = 0; i < length; i++) {
    const cx = direction === "horizontal" ? x + i : x;
    const cy = direction === "horizontal" ? y : y + i;
    const targetCell = grid.querySelector(`[x="${cx}"][y="${cy}"]`);
    if (targetCell) {
      targetCell.classList.remove("valid", "invalid");
      if (state === "drop" && valid) targetCell.classList.add("drop");
      if (valid !== null && state === null)
        targetCell.classList.add(valid ? "valid" : "invalid");
    }
  }
}

function displayRandomGeneratedShips(grid) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (game.player.gameboard.board[y][x] instanceof Ship) {
        const cell = grid.querySelector(`[x="${x}"][y="${y}"]`);
        cell.classList.add("drop");
      }
    }
  }
}

function displayCellHits(cell, hit, x, y, grid) {
  if (hit === true) cell.classList.add("hit");
  if (hit === false) cell.classList.add("miss");
  if (hit === "sunk") {
    cell.classList.remove("drop");
    cell.classList.add("sunk");
    displaySunkShip(x, y, grid);
  }
}

function displaySunkShip(x, y, grid) {
  let cell = null;
  const possibleMoves = [-1, 1];
  for (const move of possibleMoves) {
    const cx = x + move,
      cy = y + move;
    if (cx >= 0 && cx < 10) {
      cell = grid.querySelector(`[x="${cx}"][y="${y}"]`);
      if (cell.classList.contains("hit")) {
        cell.classList.remove("drop");
        cell.classList.remove("hit");
        cell.classList.add("sunk");
        displaySunkShip(cx, y, grid);
      }
    }
    if (cy >= 0 && cy < 10) {
      cell = grid.querySelector(`[x="${x}"][y="${cy}"]`);
      if (cell.classList.contains("hit")) {
        cell.classList.remove("drop");
        cell.classList.remove("hit");
        cell.classList.add("sunk");
        displaySunkShip(x, cy, grid);
      }
    }
  }
}
