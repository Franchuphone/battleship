import { setupPlayer } from "../html/setupPlayer";
import { Game } from "./objects";

let dragData = {};

export function displayHeader(string = "Welcome to Battleship War !") {
  const { header } = listenElements();
  header.textContent = string;
}

export function displaySetup() {
  const { leftPanel, rightPanel } = listenElements();
  leftPanel.innerHTML = setupPlayer;
}

export function displayGrid(playerName, type, game) {
  const { rightPanel } = listenElements(),
    gridName = document.createElement("div"),
    grid = generateGrid(playerName),
    cells = grid.querySelectorAll(".cell");
  gridName.textContent = playerName;
  rightPanel.innerHTML = "";
  rightPanel.append(gridName, grid);

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
        // console.log(valid, [x, y], length, direction);
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
          valid = game.player.gameboard.isValidPlacement(
            [x, y],
            length,
            direction,
          );
        highlightCells(grid, x, y, length, direction, valid, "drop");
        game.placePlayerShip([x, y], length, direction);
        const ghost = dragData.element;
        ghost.classList.add("placed");
        ghost.setAttribute("draggable", false);
        // dragData.element.replaceWith(ghost);
      });
    });
  }
  if (type === "battle-enemy") {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const x = parseInt(cell.getAttribute("x"));
        const y = parseInt(cell.getAttribute("y"));
        const { hit, winner, attackedCoord } = game.playTurn([x, y]);
        if (hit === true) cell.classList.add("hit");
        if (hit === false) cell.classList.add("miss");
        if (hit === "sunk") cell.classList.add("sunk");
        if (winner);
      });
    });
  }
}

export function listenElements() {
  const container = document.querySelector(".container");
  const header = document.querySelector(".header");
  const leftPanel = document.querySelector(".left-panel");
  const rightPanel = document.querySelector(".right-panel");
  const infoBar = document.querySelector(".info-bar");
  const fleet = document.querySelector(".fleet");
  return {
    container,
    header,
    leftPanel,
    rightPanel,
    infoBar,
    fleet,
  };
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

export function generateFleet() {
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
  ship.addEventListener("dragstart", (e) => {
    dragData.length = ship.getAttribute("length");
    dragData.direction = ship.getAttribute("direction");
    dragData.element = ship;
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
      else if (valid !== null)
        targetCell.classList.add(valid ? "valid" : "invalid");
      if (valid !== null && state === null)
        targetCell.classList.add(valid ? "valid" : "invalid");
    }
  }
}
