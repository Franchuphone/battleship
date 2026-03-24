import "./css/modern-normalize.css";
import "./css/main-style.css";
import images from "/src/js/images.js";
import {
  displayGrid,
  displayHeader,
  displaySetup,
  generateFleet,
  listenElements,
} from "./js/ui";
import { Game } from "./js/objects";

const game = new Game("Your fleet");

displayHeader();
displaySetup(game);
