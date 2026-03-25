import { listenElements, game, displayBattle, displayEndGame } from "./ui";

export function handleStartBtn() {
  const { playerName } = listenElements();
  game.renamePlayer(playerName.value);
  game.start();
  displayBattle();
}

export function handlePlayerAttack(coord, onComputerAttack) {
  const { hit, winner } = game.playTurn(coord);
  if (winner) displayEndGame(winner);
  else setTimeout(() => handleComputerAttack(onComputerAttack), 1000);
  return hit;
}

export function handleComputerAttack(callback) {
  const { hit, winner, attackedCoord } = game.playTurn();
  if (winner) displayEndGame(winner);
  callback(hit, attackedCoord);
}
