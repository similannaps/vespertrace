
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

    // ขนาดพื้นที่เกมหลัก
    width: GAME_WIDTH,
    height: GAME_HEIGHT,

    backgroundColor: "#05040a",

    // ตั้งค่าภาพ
    pixelArt: false,
    antialias: true,

    // รองรับหน้าจอคอมพิวเตอร์และโทรศัพท์
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },

    // รองรับการสัมผัสหน้าจอ
    input: {
      activePointers: 3,
    },

    // Scenes ของเกม
    scene: [
      BootScene,
      TitleScene,
      LevelSelectScene,
      ComingSoonScene,
    ],
  };
}
