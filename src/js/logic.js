import {
  listenElements,
  game,
  displayBattle,
  displayEndGame,
  displayInfoBar,
} from "./ui";

export function handleStartBtn() {
  const { playerName } = listenElements();
  game.renamePlayer(playerName.value);
  game.start();
  displayBattle();
}

export function handlePlayerAttack(coord, onComputerAttack) {
  const { hit, winner } = game.playTurn(coord);
  if (winner) displayEndGame(winner);
  displayInfoBar("Waiting for ennemy's attack");
  if (!winner) setTimeout(() => handleComputerAttack(onComputerAttack), 1000);
  return hit;
}

export function handleComputerAttack(callback) {
  const { hit, winner, attackedCoord } = game.playTurn();
  if (winner) displayEndGame(winner);
  displayInfoBar("Your turn to attack");
  callback(hit, attackedCoord);
}
