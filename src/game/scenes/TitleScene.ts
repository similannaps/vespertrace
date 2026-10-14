
import Phaser from "phaser";

type Character = {
  name: string;
  description: string;
  color: number;
  light: string;
  accent: number;
};

export class TitleScene extends Phaser.Scene {
  private characters: Character[] = [
    {
      name: "LUNA",
      description: "THE DREAMER",
      color: 0xb68cff,
      light: "#e4ccff",
      accent: 0xf4b8ff,
    },
    {
      name: "MOSS",
      description: "THE FOREST SPIRIT",
      color: 0x79d98c,
      light: "#c8ffd0",
      accent: 0xe5ff9c,
    },
    {
      name: "PEACH",
      description: "THE LITTLE STAR",
      color: 0xffa38c,
      light: "#ffe0ce",
      accent: 0xffd477,
    },
    {
      name: "ECHO",
      description: "THE LOST GHOST",
      color: 0x78caff,
      light: "#d2f0ff",
      accent: 0xb8f4ff,
    },
  ];

  private selectedCharacter = 0;
  private characterCards: Phaser.GameObjects.Container[] = [];
  private characterNameText!: Phaser.GameObjects.Text;
  private characterDescriptionText!: Phaser.GameObjects.Text;
  private preview!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "TitleScene" });
  }

  create(): void {
    const { width, height } = this.scale;

    this.characterCards = [];
    this.selectedCharacter = 0;

    this.cameras.main.setBackgroundColor("#17182e");

    this.createSky(width, height);
    this.createStars();
    this.createForest();
    this.createFlowers();
    this.createAmbientParticles();

    // Game title
    this.add
      .text(width / 2, 62, "AFTERIMAGE", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "36px",
        color: "#f4d5ff",
        stroke: "#574477",
        strokeThickness: 7,
        shadow: {
          offsetX: 0,
          offsetY: 5,
          color: "#a37bdb",
          blur: 0,
          fill: true,
          stroke: true,
        },
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 112, "YOUR PAST BECOMES YOUR OBSTACLE", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "13px",
        color: "#c8c6ee",
      })
      .setOrigin(0.5);

    // Character selection heading
    this.add
      .text(width / 2, 165, "CHOOSE YOUR CHARACTER", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "13px",
        color: "#fff0c9",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 190, "PICK A LITTLE SPIRIT TO BEGIN YOUR JOURNEY", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "10px",
        color: "#b9badc",
      })
      .setOrigin(0.5);

    this.createCharacterCards(width);

    // Selected character preview
    this.preview = this.add.container(width / 2, 360);
    this.drawCharacter(this.preview, this.characters[0]!, 1.8);

    this.characterNameText = this.add
      .text(width / 2, 410, "", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "15px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.characterDescriptionText = this.add
      .text(width / 2, 435, "", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "11px",
        color: "#d3c5f3",
      })
      .setOrigin(0.5);

    this.updateCharacterPreview();

    // Start game button
    this.createButton(
      width / 2,
      480,
      "START GAME",
      () => {
        const character = this.characters[this.selectedCharacter]!;

        this.scene.start("ComingSoonScene", {
          character: character.name,
          characterColor: character.color,
          characterAccent: character.accent,
          levelId: 1,
        });
      },
      true,
    );

    // Level selection button
    this.createButton(
      width / 2,
      530,
      "LEVEL SELECT",
      () => {
        const character = this.characters[this.selectedCharacter]!;

        this.scene.start("LevelSelectScene", {
          character: character.name,
          characterColor: character.color,
          characterAccent: character.accent,
        });
      },
      false,
    );

    // Instructions button
    this.createButton(
      width / 2,
      580,
      "HOW TO PLAY",
      () => this.showInstructions(),
      false,
    );

    // Footer
    this.add
      .text(
        width / 2,
        630,
        "A PIXEL PUZZLE ABOUT THE GHOSTS YOU LEAVE BEHIND",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "10px",
          color: "#b9badc",
          align: "center",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(width / 2, 660, "MOVE: WASD / ARROWS     RESTART: R", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "11px",
        color: "#b6f0d4",
      })
      .setOrigin(0.5);
  }

  private createSky(width: number, height: number): void {
    const g = this.add.graphics();

    g.fillGradientStyle(
      0x29294c,
      0x29294c,
      0x59416d,
      0x59416d,
      1,
    );
    g.fillRect(0, 0, width, height);

    // Distant mountains
    g.fillStyle(0x393456, 1);
    g.fillTriangle(0, 440, 190, 235, 390, 440);
    g.fillTriangle(230, 440, 500, 260, 730, 440);
    g.fillTriangle(630, 440, 910, 225, 1160, 440);
    g.fillTriangle(950, 440, 1130, 290, 1280, 440);

    // Moon glow
    g.fillStyle(0xffe8c0, 0.12);
    g.fillCircle(width - 170, 105, 48);

    g.fillStyle(0xffedce, 1);
    g.fillCircle(width - 170, 105, 29);

    // Pixel marks on the moon
    g.fillStyle(0xe6d1b6, 0.7);
    g.fillRect(width - 184, 91, 8, 8);
    g.fillRect(width - 161, 113, 10, 6);
    g.fillRect(width - 177, 120, 5, 5);

    // Forest ground
    g.fillStyle(0x263b42, 1);
    g.fillRect(0, 440, width, 280);

    g.fillStyle(0x35534a, 1);
    g.fillRect(0, 460, width, 260);

    // Ground highlights
    g.fillStyle(0x52715a, 0.75);

    for (let x = 0; x < width; x += 48) {
      g.fillRect(x, 470 + ((x / 48) % 3) * 5, 18, 4);
    }

    // Pixel path
    g.fillStyle(0x6a6375, 0.55);
    g.fillRect(width / 2 - 90, 465, 180, 255);
    g.fillRect(width / 2 - 125, 525, 250, 28);
    g.fillRect(width / 2 - 105, 605, 210, 25);

    // Path stones
    g.fillStyle(0xb3a0a9, 0.65);
    g.fillRect(width / 2 - 72, 490, 24, 8);
    g.fillRect(width / 2 + 40, 530, 20, 8);
    g.fillRect(width / 2 - 22, 590, 30, 8);

    g.setDepth(-5);
  }

  private createStars(): void {
    const g = this.add.graphics();

    const stars: [number, number, number][] = [
      [75, 65, 4],
      [150, 150, 3],
      [235, 55, 4],
      [340, 120, 3],
      [430, 55, 5],
      [550, 100, 3],
      [670, 65, 4],
      [780, 135, 3],
      [895, 55, 4],
      [1010, 150, 3],
      [1100, 45, 4],
      [1200, 200, 3],
      [80, 260, 3],
      [340, 230, 4],
      [610, 210, 3],
      [850, 240, 4],
      [1040, 270, 3],
      [1190, 320, 4],
    ];

    for (const [x, y, size] of stars) {
      g.fillStyle(0xffe6c4, 0.85);
      g.fillRect(x, y, size, size);

      if (size >= 4) {
        g.fillRect(x + size / 2 - 1, y - 3, 2, size + 6);
        g.fillRect(x - 3, y + size / 2 - 1, size + 6, 2);
      }
    }

    g.setDepth(-4);
  }

  private createForest(): void {
    const treePositions = [
      { x: 25, y: 360, s: 1.15, c: 0x35534d },
      { x: 120, y: 390, s: 0.85, c: 0x44634f },
      { x: 250, y: 370, s: 1.1, c: 0x304b48 },
      { x: 385, y: 400, s: 0.75, c: 0x50664f },
      { x: 900, y: 390, s: 0.9, c: 0x405c50 },
      { x: 1050, y: 370, s: 1.1, c: 0x304b48 },
      { x: 1170, y: 395, s: 0.9, c: 0x49634c },
      { x: 1250, y: 360, s: 1.1, c: 0x354f48 },
    ];

    for (const tree of treePositions) {
      this.drawTree(tree.x, tree.y, tree.s, tree.c);
    }

    const g = this.add.graphics();

    const bushes: [number, number, number][] = [
      [25, 485, 0x527458],
      [190, 480, 0x65835b],
      [315, 495, 0x456c58],
      [910, 490, 0x557b5a],
      [1080, 480, 0x64845b],
      [1210, 490, 0x466954],
    ];

    for (const [x, y, color] of bushes) {
      g.fillStyle(color, 1);
      g.fillRect(x, y, 42, 18);
      g.fillRect(x + 7, y - 9, 25, 12);
      g.fillRect(x + 14, y - 15, 12, 8);

      g.fillStyle(0x9bbd76, 0.85);
      g.fillRect(x + 8, y - 5, 7, 4);
      g.fillRect(x + 26, y + 2, 6, 4);
    }

    g.setDepth(-2);
  }

  private drawTree(
    x: number,
    y: number,
    scale: number,
    leafColor: number,
  ): void {
    const g = this.add.graphics();

    // Trunk
    g.fillStyle(0x49384b, 1);
    g.fillRect(x - 7 * scale, y - 55 * scale, 14 * scale, 60 * scale);

    // Pixel canopy
    g.fillStyle(leafColor, 1);
    g.fillRect(x - 30 * scale, y - 85 * scale, 60 * scale, 25 * scale);
    g.fillRect(x - 22 * scale, y - 105 * scale, 44 * scale, 25 * scale);
    g.fillRect(x - 12 * scale, y - 120 * scale, 24 * scale, 20 * scale);
    g.fillRect(x - 39 * scale, y - 70 * scale, 16 * scale, 18 * scale);
    g.fillRect(x + 23 * scale, y - 70 * scale, 16 * scale, 18 * scale);

    // Leaf highlights
    g.fillStyle(0x91b978, 0.8);
    g.fillRect(x - 17 * scale, y - 97 * scale, 10 * scale, 7 * scale);
    g.fillRect(x + 8 * scale, y - 79 * scale, 11 * scale, 6 * scale);

    // Little fruit
    g.fillStyle(0xffb2c8, 0.95);
    g.fillRect(x + 14 * scale, y - 68 * scale, 5 * scale, 5 * scale);

    g.setDepth(-3);
  }

  private createFlowers(): void {
    const g = this.add.graphics();

    const flowers: [number, number, number][] = [
      [65, 550, 0xffa7ce],
      [140, 610, 0xffe4a3],
      [270, 535, 0xbda5ff],
      [355, 650, 0xffa7ce],
      [880, 550, 0xffe4a3],
      [960, 620, 0xffa7ce],
      [1110, 560, 0xbda5ff],
      [1200, 640, 0xffe4a3],
    ];

    for (const [x, y, color] of flowers) {
      g.fillStyle(0x477653, 1);
      g.fillRect(x + 2, y + 5, 3, 12);

      g.fillStyle(color, 1);
      g.fillRect(x, y, 7, 7);
      g.fillRect(x - 4, y + 3, 5, 5);
      g.fillRect(x + 5, y + 3, 5, 5);
      g.fillRect(x + 2, y - 4, 4, 5);

      g.fillStyle(0xffe8a6, 1);
      g.fillRect(x + 2, y + 3, 3, 3);
    }

    // Tiny mushrooms
    const mushrooms: [number, number, number][] = [
      [185, 525, 0xff8c9c],
      [400, 575, 0xf4a6d7],
      [845, 600, 0xff8c9c],
      [1140, 520, 0xf4a6d7],
    ];

    for (const [x, y, color] of mushrooms) {
      g.fillStyle(0xf0d5b5, 1);
      g.fillRect(x + 5, y + 8, 7, 10);

      g.fillStyle(color, 1);
      g.fillRect(x, y + 4, 18, 6);
      g.fillRect(x + 3, y, 12, 6);

      g.fillStyle(0xffe8d9, 1);
      g.fillRect(x + 5, y + 3, 3, 3);
      g.fillRect(x + 12, y + 6, 3, 2);
    }

    g.setDepth(-1);
  }

  private createCharacterCards(width: number): void {
    const cardWidth = 105;
    const gap = 17;
    const totalWidth = this.characters.length * cardWidth + 3 * gap;
    const startX = (width - totalWidth) / 2 + cardWidth / 2;
    const y = 260;

    this.characters.forEach((character, index) => {
      const x = startX + index * (cardWidth + gap);
      const card = this.add.container(x, y);

      const background = this.add.rectangle(
        0,
        0,
        cardWidth,
        94,
        0x292b47,
        0.95,
      );

      background.setStrokeStyle(
        2,
        index === this.selectedCharacter ? character.color : 0x575572,
      );

      card.add(background);

      // Small character sprite
      this.drawCharacter(card, character, 0.9, 0, -8);

      const name = this.add
        .text(0, 30, character.name, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "8px",
          color: character.light,
        })
        .setOrigin(0.5);

      card.add(name);

      const marker = this.add.rectangle(0, -43, 10, 4, character.accent);
      marker.setName("selection-marker");
      marker.setVisible(index === this.selectedCharacter);
      card.add(marker);

      const hitArea = this.add
        .rectangle(0, 0, cardWidth, 94, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });

      card.add(hitArea);

      hitArea.on("pointerdown", () => {
        this.selectedCharacter = index;
        this.updateCharacterPreview();
      });

      hitArea.on("pointerover", () => {
        if (index !== this.selectedCharacter) {
          background.setStrokeStyle(2, character.accent);
        }
      });

      hitArea.on("pointerout", () => {
        background.setStrokeStyle(
          2,
          index === this.selectedCharacter
            ? character.color
            : 0x575572,
        );
      });

      card.setData("background", background);
      card.setData("character", character);
      card.setData("index", index);

      this.characterCards.push(card);
    });
  }

  private drawCharacter(
    parent: Phaser.GameObjects.Container,
    character: Character,
    scale: number,
    offsetX = 0,
    offsetY = 0,
  ): void {
    const sprite = this.add.container(offsetX, offsetY);
    const g = this.add.graphics();

    // Soft glow
    g.fillStyle(character.color, 0.18);
    g.fillRect(-17 * scale, -19 * scale, 34 * scale, 37 * scale);

    // Body
    g.fillStyle(character.color, 1);
    g.fillRect(-10 * scale, -15 * scale, 20 * scale, 23 * scale);
    g.fillRect(-14 * scale, -9 * scale, 4 * scale, 13 * scale);
    g.fillRect(10 * scale, -9 * scale, 4 * scale, 13 * scale);

    // Feet
    g.fillStyle(0x29223d, 1);
    g.fillRect(-9 * scale, 8 * scale, 7 * scale, 5 * scale);
    g.fillRect(3 * scale, 8 * scale, 7 * scale, 5 * scale);

    // Face
    g.fillStyle(0x30263f, 1);
    g.fillRect(-6 * scale, -8 * scale, 3 * scale, 5 * scale);
    g.fillRect(3 * scale, -8 * scale, 3 * scale, 5 * scale);

    // Blush
    g.fillStyle(character.accent, 1);
    g.fillRect(-8 * scale, -2 * scale, 3 * scale, 2 * scale);
    g.fillRect(5 * scale, -2 * scale, 3 * scale, 2 * scale);

    // Top sparkle
    g.fillStyle(character.accent, 1);
    g.fillRect(-2 * scale, -20 * scale, 4 * scale, 4 * scale);
    g.fillRect(-5 * scale, -17 * scale, 3 * scale, 2 * scale);
    g.fillRect(2 * scale, -17 * scale, 3 * scale, 2 * scale);

    sprite.add(g);
    parent.add(sprite);
  }

  private updateCharacterPreview(): void {
    const selected = this.characters[this.selectedCharacter]!;

    this.characterNameText.setText(selected.name);
    this.characterNameText.setColor(selected.light);
    this.characterDescriptionText.setText(selected.description);

    this.characterCards.forEach((card, index) => {
      const character = card.getData("character") as Character;
      const background = card.getData(
        "background",
      ) as Phaser.GameObjects.Rectangle;

      background.setStrokeStyle(
        2,
        index === this.selectedCharacter ? character.color : 0x575572,
      );

      const marker = card.getByName(
        "selection-marker",
      ) as Phaser.GameObjects.Rectangle | null;

      marker?.setVisible(index === this.selectedCharacter);
    });

    // Rebuild the large preview
    this.preview.removeAll(true);
    this.drawCharacter(this.preview, selected, 1.8);

    // Gentle floating animation
    this.tweens.killTweensOf(this.preview);

    this.tweens.add({
      targets: this.preview,
      y: 355,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private createAmbientParticles(): void {
    if (!this.textures.exists("afterimage-particle")) {
      const g = this.add.graphics();

      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 4, 4);
      g.generateTexture("afterimage-particle", 4, 4);
      g.destroy();
    }

    const particles = this.add.particles(
      0,
      0,
      "afterimage-particle",
      {
        x: { min: 0, max: this.scale.width },
        y: { min: 220, max: this.scale.height },
        lifespan: 6500,
        speedX: { min: -7, max: 7 },
        speedY: { min: -12, max: -3 },
        scale: { start: 1.4, end: 0 },
        alpha: { start: 0.85, end: 0 },
        quantity: 1,
        frequency: 220,
        tint: [0xffd477, 0xffa7ce, 0xbda5ff, 0x9cf7d4],
        blendMode: Phaser.BlendModes.ADD,
      },
    );

    particles.setDepth(0);
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    callback: () => void,
    primary: boolean,
  ): void {
    const buttonWidth = 270;
    const buttonHeight = 40;

    const fillColor = primary ? 0x59416d : 0x30304c;
    const borderColor = primary ? 0xffd477 : 0x9386bb;
    const textColor = primary ? "#fff0c9" : "#e2dcff";

    const background = this.add.rectangle(
      x,
      y,
      buttonWidth,
      buttonHeight,
      fillColor,
      0.97,
    );

    background.setStrokeStyle(2, borderColor);

    const text = this.add
      .text(x, y, label, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "11px",
        color: textColor,
      })
      .setOrigin(0.5);

    const hitArea = this.add
      .rectangle(x, y, buttonWidth, buttonHeight, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });

    hitArea.on("pointerover", () => {
      background.setFillStyle(primary ? 0x76558d : 0x464566);
      background.setStrokeStyle(2, 0xffd477);
      text.setColor("#ffffff");
    });

    hitArea.on("pointerout", () => {
      background.setFillStyle(fillColor);
      background.setStrokeStyle(2, borderColor);
      text.setColor(textColor);
    });

    hitArea.on("pointerdown", callback);
  }

  private showInstructions(): void {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x111020,
      0.88,
    );

    const panel = this.add.rectangle(
      width / 2,
      height / 2,
      650,
      360,
      0x292642,
    );

    panel.setStrokeStyle(3, 0xe2c1ff);

    const title = this.add
      .text(width / 2, 220, "HOW TO PLAY", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "20px",
        color: "#f4d5ff",
      })
      .setOrigin(0.5);

    const instructions = this.add
      .text(
        width / 2,
        325,
        [
          "MOVE: WASD OR ARROW KEYS",
          "",
          "EVERY MOVE LEAVES AN AFTERIMAGE.",
          "YOUR AFTERIMAGES BLOCK YOUR PATH.",
          "",
          "LEAVE A SHADOW ON THE SWITCH",
          "TO UNLOCK THE DOOR.",
          "",
          "REACH THE EXIT TO ESCAPE.",
        ],
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "16px",
          color: "#fff0e1",
          align: "center",
          lineSpacing: 5,
        },
      )
      .setOrigin(0.5);

    const close = this.add
      .text(width / 2, 485, "[ CLOSE ]", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "12px",
        color: "#ffb0c8",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const popup = this.add.container(0, 0, [
      overlay,
      panel,
      title,
      instructions,
      close,
    ]);

    popup.setDepth(20);

    close.on("pointerdown", () => {
      popup.destroy();
    });

    overlay.setInteractive({ useHandCursor: true });

    overlay.on("pointerdown", () => {
      popup.destroy();
    });
  }
}
