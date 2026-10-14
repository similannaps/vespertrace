import Phaser from "phaser";
import { createGameConfig } from "./game/config";

const parent = "game";
const host = document.getElementById(parent);

if (!host) {
  throw new Error('Missing #game container');
}

new Phaser.Game(createGameConfig(parent));
