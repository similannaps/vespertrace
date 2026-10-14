
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { ComingSoonScene } from "./scenes/ComingSoonScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { TitleScene } from "./scenes/TitleScene";

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export function createGameConfig(
  parent: string,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#05040a",
    pixelArt: false,
    antialias: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      BootScene,
      TitleScene,
      LevelSelectScene,
      ComingSoonScene,
    ],
  };
}
