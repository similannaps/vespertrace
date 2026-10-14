
import Phaser from "phaser";
import {
  LEVELS,
  getUnlockedLevel,
} from "../levels/levelData";

type CharacterData = {
  character?: string;
  characterColor?: number;
  characterAccent?: number;
};

export class LevelSelectScene extends Phaser.Scene {
  private characterData: CharacterData = {};

  constructor() {
    super({ key: "LevelSelectScene" });
  }

  init(data: CharacterData): void {
    this.characterData = data ?? {};
  }

  create(): void {
    const { width, height } = this.scale;
    const unlocked = getUnlockedLevel();

    this.cameras.main.setBackgroundColor("#17182e");

    const bg = this.add.graphics();
    bg.fillGradientStyle(
      0x29294c, 0x29294c, 0x59416d, 0x59416d, 1,
    );
    bg.fillRect(0, 0, width, height);

    this.add
      .text(width / 2, 64, "SELECT YOUR PATH", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "24px",
        color: "#f4d5ff",
        stroke: "#574477",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 105, "EVERY MEMORY LEADS SOMEWHERE", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "13px",
        color: "#c8c6ee",
      })
      .setOrigin(0.5);

    const cardWidth = 320;
    const cardHeight = 285;
    const gap = 22;
    const totalWidth = LEVELS.length * cardWidth
      + (LEVELS.length - 1) * gap;
    const startX = (width - totalWidth) / 2 + cardWidth / 2;

    LEVELS.forEach((level, index) => {
      const x = startX + index * (cardWidth + gap);
      const y = 350;
      const isUnlocked = level.id <= unlocked;

      const card = this.add.rectangle(
        x, y, cardWidth, cardHeight,
        isUnlocked ? 0x292b47 : 0x171724,
        0.98,
      );

      card.setStrokeStyle(
        2,
        isUnlocked ? 0xb995e8 : 0x555166,
      );

      this.add
        .text(x, y - 105, `STAGE ${String(level.id).padStart(2, "0")}`, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "12px",
          color: isUnlocked ? "#ffd477" : "#8b8798",
        })
        .setOrigin(0.5);

      this.add
        .text(x, y - 65, level.name, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "10px",
          color: isUnlocked ? "#f4d5ff" : "#8b8798",
          align: "center",
          wordWrap: { width: cardWidth - 30 },
        })
        .setOrigin(0.5);

      this.add
        .text(
          x,
          y + 5,
          isUnlocked
            ? level.story
            : "A MEMORY STILL SEALED...",
          {
            fontFamily: '"Silkscreen", monospace',
            fontSize: "13px",
            color: isUnlocked ? "#d3c5f3" : "#777286",
            align: "center",
            wordWrap: { width: cardWidth - 40 },
            lineSpacing: 7,
          },
        )
        .setOrigin(0.5);

      const action = this.add
        .text(
          x,
          y + 100,
          isUnlocked ? "[ PLAY STAGE ]" : "[ LOCKED ]",
          {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "10px",
            color: isUnlocked ? "#b6f0d4" : "#777286",
            backgroundColor: isUnlocked ? "#30304c" : "#20202e",
            padding: { x: 12, y: 12 },
          },
        )
        .setOrigin(0.5);

      if (isUnlocked) {
        action.setInteractive({ useHandCursor: true });

        action.on("pointerover", () => {
          action.setColor("#ffffff");
        });

        action.on("pointerout", () => {
          action.setColor("#b6f0d4");
        });

        action.on("pointerdown", () => {
          this.scene.start("ComingSoonScene", {
            ...this.characterData,
            levelId: level.id,
          });
        });

        card.setInteractive({ useHandCursor: true });
        card.on("pointerdown", () => {
          this.scene.start("ComingSoonScene", {
            ...this.characterData,
            levelId: level.id,
          });
        });
      }
    });

    this.add
      .text(width / 2, 575, `UNLOCKED: ${unlocked} / ${LEVELS.length}`, {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "13px",
        color: "#b6f0d4",
      })
      .setOrigin(0.5);

    const back = this.add
      .text(width / 2, 630, "[ BACK TO TITLE ]", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "12px",
        color: "#fff0c9",
        backgroundColor: "#59416d",
        padding: { x: 16, y: 13 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    back.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}
