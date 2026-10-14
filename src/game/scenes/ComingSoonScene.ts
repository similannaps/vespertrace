
import Phaser from "phaser";
import {
  LEVELS,
  getUnlockedLevel,
  unlockLevel,
  type LevelData,
  type Cell,
} from "../levels/levelData";

const COLS = 15;
const ROWS = 9;
const TILE = 56;
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const COLORS = {
  background: 0x15131c,
  floor: 0x211e28,
  floorBorder: 0x393440,
  wall: 0x49434f,
  wallHighlight: 0x807487,

  violet: 0xb995e8,
  violetDark: 0x30263b,
  violetLight: 0xe8d9f8,
  violetGlow: 0x9368c5,
  shadow: 0xb995e8,
  shadowDark: 0x30263b,

  heart: 0xff304f,
  heartHighlight: 0xffa0a5,
  heartDark: 0x08070d,
  heartBorder: 0x000000,

  switchGreen: 0x55d98a,
  switchGreenDark: 0x173b2a,
  doorGold: 0xffc857,
  doorGoldDark: 0x4a3515,
  exitBlue: 0x69c8ff,
  exitBlueDark: 0x18364b,

  white: 0xffffff,
  text: 0xe8e2ef,
  mutedText: 0xa9a1b4,
  danger: 0xff4d5a,
  dangerDark: 0x541e2a,
  panel: 0x211b2a,
};

type CharacterData = {
  character?: string;
  characterColor?: number;
  characterAccent?: number;
  levelId?: number;
};

export class ComingSoonScene extends Phaser.Scene {
  private startCell: Cell = { col: 1, row: 1 };
  private switchCell: Cell = { col: 5, row: 4 };
  private doorCell: Cell = { col: 10, row: 4 };
  private exitCell: Cell = { col: 13, row: 7 };

  private levelId = 1;
  private currentLevel: LevelData = LEVELS[0]!;

  private selectedCharacter = {
    name: "LUNA",
    color: 0xb68cff,
    accent: 0xf4b8ff,
  };

  private player: Cell = { col: 1, row: 1 };
  private shadows: Cell[] = [];
  private walls = new Set<string>();

  private won = false;
  private gameOver = false;
  private moving = false;
  private doorOpen = false;

  private health = 3;
  private lastDamageTime = -1000;
  private readonly damageCooldown = 350;

  private boardX = 0;
  private boardY = 0;

  private boardGraphics!: Phaser.GameObjects.Graphics;
  private heartGraphics!: Phaser.GameObjects.Graphics;
  private statusText!: Phaser.GameObjects.Text;
  private doorLabel!: Phaser.GameObjects.Text;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  private keys?: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    R: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: "ComingSoonScene" });
  }

  init(data: CharacterData): void {
    this.selectedCharacter = {
      name: data.character ?? "LUNA",
      color: data.characterColor ?? 0xb68cff,
      accent: data.characterAccent ?? 0xf4b8ff,
    };

    // เลือกด่านตามข้อมูลที่ส่งมาจากหน้าเลือกด่าน
    const requestedLevel = Math.floor(data.levelId ?? 1);
    const unlockedLevel = getUnlockedLevel();

    this.levelId = Math.max(
      1,
      Math.min(requestedLevel, unlockedLevel, LEVELS.length),
    );

    this.currentLevel =
      LEVELS.find((level) => level.id === this.levelId) ??
      LEVELS[0]!;

    // ใช้ตำแหน่งของแต่ละด่านจาก levelData.ts
    this.startCell = { ...this.currentLevel.start };
    this.switchCell = { ...this.currentLevel.switch };
    this.doorCell = { ...this.currentLevel.door };
    this.exitCell = { ...this.currentLevel.exit };
  }

  create(): void {
    this.player = { ...this.startCell };
    this.shadows = [];
    this.walls = new Set<string>();

    this.won = false;
    this.gameOver = false;
    this.moving = false;
    this.doorOpen = false;

    this.health = 3;
    this.lastDamageTime = -1000;

    this.cameras.main.setBackgroundColor(COLORS.background);

    this.boardX = (GAME_WIDTH - COLS * TILE) / 2;
    this.boardY = 132;

    this.createWalls();

    this.boardGraphics = this.add.graphics();
    this.heartGraphics = this.add.graphics().setDepth(5);

    this.add
      .text(640, 24, "AFTERIMAGE", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "25px",
        color: "#e8d9f8",
        stroke: "#000000",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(640, 60, "YOUR PAST BECOMES YOUR OBSTACLE", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#b5a9c5",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // ชื่อด่านเปลี่ยนตามด่านที่กำลังเล่น
    this.add
      .text(
        640,
        82,
        `STAGE ${String(this.currentLevel.id).padStart(2, "0")}  //  ${this.currentLevel.name}`,
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "12px",
          color: "#c8b2e8",
          stroke: "#000000",
          strokeThickness: 2,
          align: "center",
        },
      )
      .setOrigin(0.5);

    // เนื้อเรื่องของด่าน
    this.add
      .text(640, 105, this.currentLevel.subtitle, {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "10px",
        color: "#a9a1b4",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(38, 111, "HP", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "10px",
        color: "#ff6979",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5)
      .setDepth(6);

    this.drawHearts();

    this.statusText = this.add
      .text(640, 650, this.currentLevel.story, {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "13px",
        color: "#e8e2ef",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
        wordWrap: { width: 1100 },
      })
      .setOrigin(0.5);

    this.add
      .text(640, 681, "MOVE: WASD / ARROWS   |   RESTART: R", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "12px",
        color: "#a9a1b4",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.addTileLabel(this.switchCell, "S", "#55d98a");

    this.doorLabel = this.addTileLabel(
      this.doorCell,
      "LOCK",
      "#ffc857",
    );

    this.addTileLabel(this.exitCell, "EXIT", "#69c8ff");

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();

      this.keys = this.input.keyboard.addKeys("W,A,S,D,R") as {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
        R: Phaser.Input.Keyboard.Key;
      };
    }

    this.drawBoard();
  }

  update(): void {
    if (!this.cursors || !this.keys) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
      this.restartCurrentLevel();
      return;
    }

    if (this.won || this.gameOver || this.moving) return;

    let dx = 0;
    let dy = 0;

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
      Phaser.Input.Keyboard.JustDown(this.keys.A)
    ) {
      dx = -1;
    } else if (
      Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
      Phaser.Input.Keyboard.JustDown(this.keys.D)
    ) {
      dx = 1;
    } else if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.W)
    ) {
      dy = -1;
    } else if (
      Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
      Phaser.Input.Keyboard.JustDown(this.keys.S)
    ) {
      dy = 1;
    }

    if (dx !== 0 || dy !== 0) {
      this.tryMove(dx, dy);
    }
  }

  private createWalls(): void {
    // สร้างกำแพงตามข้อมูลของด่านปัจจุบัน
    for (const wall of this.currentLevel.walls) {
      this.walls.add(this.cellKey(wall.col, wall.row));
    }
  }

  private tryMove(dx: number, dy: number): void {
    const next: Cell = {
      col: this.player.col + dx,
      row: this.player.row + dy,
    };

    if (
      next.col < 0 ||
      next.col >= COLS ||
      next.row < 0 ||
      next.row >= ROWS
    ) {
      return;
    }

    if (this.walls.has(this.cellKey(next.col, next.row))) {
      this.takeDamage("A WALL BLOCKS YOUR PATH!");
      return;
    }

    if (this.sameCell(next, this.doorCell) && !this.doorOpen) {
      this.takeDamage("THE DOOR IS LOCKED!");
      return;
    }

    if (this.hasShadow(next)) {
      this.takeDamage("YOUR AFTERIMAGE BLOCKS THE PATH!");
      return;
    }

    const previous: Cell = { ...this.player };

    // ทุกครั้งที่เดิน ตำแหน่งเดิมจะกลายเป็นเงา
    this.shadows.push(previous);
    this.player = next;

    // เมื่อมีเงาทับสวิตช์ ประตูจะเปิด
    if (
      !this.doorOpen &&
      this.shadows.some((shadow) =>
        this.sameCell(shadow, this.switchCell),
      )
    ) {
      this.doorOpen = true;

      this.doorLabel.setText("OPEN");
      this.doorLabel.setColor("#55d98a");

      this.statusText.setColor("#55d98a");
      this.statusText.setText(
        "SWITCH ACTIVATED! DOOR UNLOCKED.",
      );
    } else {
      this.statusText.setColor("#e8e2ef");
      this.statusText.setText(
        this.doorOpen
          ? "DOOR OPEN. FIND YOUR WAY TO THE EXIT!"
          : this.currentLevel.story,
      );
    }

    this.drawBoard();

    if (this.sameCell(this.player, this.exitCell)) {
      this.showWin();
    }
  }

  private takeDamage(message: string): void {
    const now = this.time.now;

    if (now - this.lastDamageTime < this.damageCooldown) {
      return;
    }

    this.lastDamageTime = now;
    this.health = Math.max(0, this.health - 1);

    this.drawHearts();

    if (this.health <= 0) {
      this.statusText.setColor("#ff4d5a");
      this.statusText.setText("NO HEARTS LEFT!");
      this.showGameOver();
      return;
    }

    this.statusText.setColor("#ff6979");
    this.statusText.setText(
      `${message}  HEARTS LEFT: ${this.health}`,
    );

    this.cameras.main.flash(120, 180, 50, 75, false);
  }

  private drawHearts(): void {
    this.heartGraphics.clear();

    const pixel = 4;
    const gap = 10;
    const startX = 70;
    const startY = 99;
    const outline = 2;

    const heartPixels = [
      "01100110",
      "11111111",
      "11111111",
      "11111111",
      "01111110",
      "00111100",
      "00011000",
    ];

    for (let heart = 0; heart < 3; heart++) {
      const x = startX + heart * (8 * pixel + gap);
      const active = heart < this.health;

      this.heartGraphics.fillStyle(COLORS.heartBorder, 1);

      for (let row = 0; row < heartPixels.length; row++) {
        const pixelRow = heartPixels[row]!;

        for (let col = 0; col < pixelRow.length; col++) {
          if (pixelRow[col] !== "1") continue;

          const top =
            row === 0 || heartPixels[row - 1]![col] !== "1";

          const bottom =
            row === heartPixels.length - 1 ||
            heartPixels[row + 1]![col] !== "1";

          const left =
            col === 0 || pixelRow[col - 1] !== "1";

          const right =
            col === pixelRow.length - 1 ||
            pixelRow[col + 1] !== "1";

          if (top) {
            this.heartGraphics.fillRect(
              x + col * pixel,
              startY + row * pixel - outline,
              pixel,
              outline,
            );
          }

          if (bottom) {
            this.heartGraphics.fillRect(
              x + col * pixel,
              startY + (row + 1) * pixel,
              pixel,
              outline,
            );
          }

          if (left) {
            this.heartGraphics.fillRect(
              x + col * pixel - outline,
              startY + row * pixel,
              outline,
              pixel,
            );
          }

          if (right) {
            this.heartGraphics.fillRect(
              x + (col + 1) * pixel,
              startY + row * pixel,
              outline,
              pixel,
            );
          }
        }
      }

      this.heartGraphics.fillStyle(
        active ? COLORS.heart : COLORS.heartDark,
        1,
      );

      for (let row = 0; row < heartPixels.length; row++) {
        const pixelRow = heartPixels[row]!;

        for (let col = 0; col < pixelRow.length; col++) {
          if (pixelRow[col] === "1") {
            this.heartGraphics.fillRect(
              x + col * pixel,
              startY + row * pixel,
              pixel,
              pixel,
            );
          }
        }
      }

      if (active) {
        this.heartGraphics.fillStyle(COLORS.heartHighlight, 1);

        this.heartGraphics.fillRect(
          x + pixel,
          startY + pixel,
          pixel,
          pixel,
        );

        this.heartGraphics.fillRect(
          x + pixel * 2,
          startY + pixel,
          pixel,
          pixel,
        );
      }
    }

    this.heartGraphics.setDepth(5);
  }

  private drawBoard(): void {
    this.boardGraphics.clear();

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = this.boardX + col * TILE;
        const y = this.boardY + row * TILE;
        const key = this.cellKey(col, row);

        this.boardGraphics.fillStyle(COLORS.floor, 1);
        this.boardGraphics.fillRect(
          x + 2,
          y + 2,
          TILE - 4,
          TILE - 4,
        );

        this.boardGraphics.lineStyle(1, COLORS.floorBorder, 0.9);
        this.boardGraphics.strokeRect(
          x + 2,
          y + 2,
          TILE - 4,
          TILE - 4,
        );

        this.boardGraphics.fillStyle(0x302b36, 0.9);
        this.boardGraphics.fillRect(x + 7, y + 7, 3, 3);

        if (this.walls.has(key)) {
          this.drawWall(x, y);
        }
      }
    }

    this.drawSpecialTile(
      this.switchCell,
      COLORS.switchGreen,
      COLORS.switchGreenDark,
    );

    this.drawSpecialTile(
      this.doorCell,
      this.doorOpen ? COLORS.switchGreen : COLORS.doorGold,
      this.doorOpen
        ? COLORS.switchGreenDark
        : COLORS.doorGoldDark,
    );

    this.drawSpecialTile(
      this.exitCell,
      COLORS.exitBlue,
      COLORS.exitBlueDark,
    );

    for (const shadow of this.shadows) {
      this.drawPixelShadow(shadow);
    }

    this.drawPixelPlayer(this.player);
  }

  private drawWall(x: number, y: number): void {
    this.boardGraphics.fillStyle(COLORS.wall, 1);
    this.boardGraphics.fillRect(
      x + 4,
      y + 4,
      TILE - 8,
      TILE - 8,
    );

    this.boardGraphics.lineStyle(2, COLORS.wallHighlight, 0.9);
    this.boardGraphics.strokeRect(
      x + 4,
      y + 4,
      TILE - 8,
      TILE - 8,
    );

    this.boardGraphics.fillStyle(0xb2a6b9, 0.9);
    this.boardGraphics.fillRect(x + 9, y + 9, 8, 3);
    this.boardGraphics.fillRect(x + 9, y + 12, 3, 7);

    this.boardGraphics.fillStyle(0x302b36, 1);
    this.boardGraphics.fillRect(x + 31, y + 29, 12, 4);
    this.boardGraphics.fillRect(x + 37, y + 33, 6, 5);
  }

  private drawSpecialTile(
    cell: Cell,
    borderColor: number,
    fillColor: number,
  ): void {
    const x = this.boardX + cell.col * TILE;
    const y = this.boardY + cell.row * TILE;

    this.boardGraphics.fillStyle(fillColor, 1);
    this.boardGraphics.fillRect(
      x + 4,
      y + 4,
      TILE - 8,
      TILE - 8,
    );

    this.boardGraphics.lineStyle(3, borderColor, 1);
    this.boardGraphics.strokeRect(
      x + 4,
      y + 4,
      TILE - 8,
      TILE - 8,
    );

    this.boardGraphics.fillStyle(borderColor, 1);
    this.boardGraphics.fillRect(x + 4, y + 4, 7, 3);
    this.boardGraphics.fillRect(x + 4, y + 4, 3, 7);
    this.boardGraphics.fillRect(
      x + TILE - 11,
      y + TILE - 7,
      7,
      3,
    );
    this.boardGraphics.fillRect(
      x + TILE - 7,
      y + TILE - 11,
      3,
      7,
    );
  }

  private drawPixelShadow(cell: Cell): void {
    const x = this.boardX + cell.col * TILE;
    const y = this.boardY + cell.row * TILE;

    const shadowColor = this.selectedCharacter.color;
    const shadowDark = this.selectedCharacter.accent;

    this.boardGraphics.fillStyle(shadowDark, 0.35);
    this.boardGraphics.fillRect(
      x + 10,
      y + 10,
      TILE - 20,
      TILE - 20,
    );

    this.boardGraphics.lineStyle(2, shadowColor, 0.95);
    this.boardGraphics.strokeRect(
      x + 10,
      y + 10,
      TILE - 20,
      TILE - 20,
    );

    this.boardGraphics.fillStyle(shadowColor, 1);
    this.boardGraphics.fillRect(x + 21, y + 15, 14, 5);
    this.boardGraphics.fillRect(x + 17, y + 20, 22, 14);
    this.boardGraphics.fillRect(x + 21, y + 34, 5, 5);
    this.boardGraphics.fillRect(x + 30, y + 34, 5, 5);

    this.boardGraphics.fillStyle(0x241f2b, 1);
    this.boardGraphics.fillRect(x + 22, y + 24, 3, 4);
    this.boardGraphics.fillRect(x + 31, y + 24, 3, 4);
  }

  private drawPixelPlayer(cell: Cell): void {
    const x = this.boardX + cell.col * TILE;
    const y = this.boardY + cell.row * TILE;

    const playerColor = this.selectedCharacter.color;
    const playerAccent = this.selectedCharacter.accent;

    this.boardGraphics.fillStyle(playerColor, 0.18);
    this.boardGraphics.fillRect(
      x + 8,
      y + 8,
      TILE - 16,
      TILE - 16,
    );

    this.boardGraphics.fillStyle(playerAccent, 1);
    this.boardGraphics.fillRect(x + 16, y + 10, 24, 20);

    this.boardGraphics.fillStyle(playerColor, 1);
    this.boardGraphics.fillRect(x + 19, y + 30, 18, 12);
    this.boardGraphics.fillRect(x + 16, y + 42, 9, 5);
    this.boardGraphics.fillRect(x + 31, y + 42, 9, 5);

    this.boardGraphics.fillStyle(COLORS.background, 1);
    this.boardGraphics.fillRect(x + 21, y + 17, 4, 5);
    this.boardGraphics.fillRect(x + 31, y + 17, 4, 5);

    this.boardGraphics.fillStyle(COLORS.white, 1);
    this.boardGraphics.fillRect(x + 22, y + 17, 2, 2);
    this.boardGraphics.fillRect(x + 32, y + 17, 2, 2);
  }

  private addTileLabel(
    cell: Cell,
    label: string,
    color: string,
  ): Phaser.GameObjects.Text {
    const x = this.boardX + cell.col * TILE + TILE / 2;
    const y = this.boardY + cell.row * TILE + TILE / 2;

    return this.add
      .text(x, y, label, {
        fontFamily: '"Silkscreen", monospace',
        fontSize:
          label === "LOCK" || label === "EXIT" ? "11px" : "14px",
        fontStyle: "bold",
        color,
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2);
  }

  private hasShadow(cell: Cell): boolean {
    return this.shadows.some((shadow) =>
      this.sameCell(shadow, cell),
    );
  }

  private sameCell(a: Cell, b: Cell): boolean {
    return a.col === b.col && a.row === b.row;
  }

  private cellKey(col: number, row: number): string {
    return `${col},${row}`;
  }

  private getCharacterData(): CharacterData {
    return {
      character: this.selectedCharacter.name,
      characterColor: this.selectedCharacter.color,
      characterAccent: this.selectedCharacter.accent,
      levelId: this.levelId,
    };
  }

  private restartCurrentLevel(): void {
    this.scene.restart(this.getCharacterData());
  }

  private showGameOver(): void {
    this.gameOver = true;

    const overlay = this.add.rectangle(
      640,
      360,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x08060c,
      0.9,
    );

    const panel = this.add.rectangle(
      640,
      360,
      620,
      320,
      COLORS.panel,
    );
    panel.setStrokeStyle(3, COLORS.danger);

    const title = this.add
      .text(640, 280, "GAME OVER", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "25px",
        color: "#ff4d5a",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const subtitle = this.add
      .text(640, 330, "YOUR LIGHT HAS FADED...", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "18px",
        color: "#e8e2ef",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    const retry = this.add
      .text(640, 395, "[ TRY AGAIN ]", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "13px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        backgroundColor: "#71313c",
        padding: { x: 14, y: 14 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retry.on("pointerdown", () => {
      this.restartCurrentLevel();
    });

    const menu = this.add
      .text(640, 455, "[ MAIN MENU ]", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "18px",
        color: "#c7bdd2",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menu.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });

    this.add
      .container(0, 0, [overlay, panel, title, subtitle, retry, menu])
      .setDepth(10);
  }

  private showWin(): void {
    this.won = true;

    // ปลดล็อกด่านถัดไปเมื่อชนะ
    unlockLevel(this.levelId + 1);

    const hasNextLevel = LEVELS.some(
      (level) => level.id === this.levelId + 1,
    );

    const overlay = this.add.rectangle(
      640,
      360,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x08060c,
      0.88,
    );

    const panel = this.add.rectangle(
      640,
      360,
      620,
      hasNextLevel ? 350 : 320,
      COLORS.panel,
    );
    panel.setStrokeStyle(3, COLORS.exitBlue);

    const title = this.add
      .text(640, 260, "YOU ESCAPED!", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "24px",
        color: "#69c8ff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const subtitle = this.add
      .text(640, 310, "YOU USED YOUR PAST TO ESCAPE.", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "15px",
        color: "#e8e2ef",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    const nextButton = hasNextLevel
      ? this.add
          .text(640, 370, "[ NEXT STAGE ]", {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "13px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2,
            backgroundColor: "#24516a",
            padding: { x: 14, y: 12 },
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
      : null;

    if (nextButton) {
      nextButton.on("pointerdown", () => {
        const nextLevel = this.levelId + 1;

        this.scene.start("ComingSoonScene", {
          ...this.getCharacterData(),
          levelId: nextLevel,
        });
      });
    }

    const replay = this.add
      .text(640, hasNextLevel ? 425 : 390, "[ PLAY AGAIN ]", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "17px",
        color: "#c7eaff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    replay.on("pointerdown", () => {
      this.restartCurrentLevel();
    });

    const menu = this.add
      .text(640, hasNextLevel ? 470 : 440, "[ MAIN MENU ]", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "17px",
        color: "#c7bdd2",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menu.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });

    this.add
      .container(
        0,
        0,
        [
          overlay,
          panel,
          title,
          subtitle,
          ...(nextButton ? [nextButton] : []),
          replay,
          menu,
        ],
      )
      .setDepth(10);
  }
}
