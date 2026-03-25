import { listenElements, game, displayBattle, displayEndGame } from "./ui";

export function handleStartBtn() {
  const { playerName } = listenElements();
  game.renamePlayer(playerName.value);
  game.start();
  displayBattle();
}

export function handlePlayerAttack(coord) {
  const { hit, winner, attackedCoord } = game.playTurn(coord);
  if (winner) displayEndGame(winner); // new funtion to display end game menu and restart button, blocking all other actions
  setTimeout(handleComputerAttack, 1000);
  return hit;
}

export function handleComputerAttack() {
  const { hit, winner, attackedCoord } = game.playTurn();
  if (winner) displayEndGame(winner);
  return { hit, attackedCoord };
}
