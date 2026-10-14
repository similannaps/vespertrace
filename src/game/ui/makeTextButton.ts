import Phaser from "phaser";

type ButtonOptions = {
  x: number;
  y: number;
  label: string;
  width?: number;
  height?: number;
  fill?: number;
  onClick: () => void;
};

export function makeTextButton(
  scene: Phaser.Scene,
  options: ButtonOptions,
): Phaser.GameObjects.Container {
  const width = options.width ?? 280;
  const height = options.height ?? 58;
  const fill = options.fill ?? 0x12f7c8;

  const container = scene.add.container(options.x, options.y);
  const bg = scene.add.rectangle(0, 0, width, height, fill, 1).setOrigin(0.5);
  const border = scene.add
    .rectangle(0, 0, width, height)
    .setOrigin(0.5)
    .setStrokeStyle(1.5, 0xe8fff4, 0.35);

  const label = scene.add
    .text(0, 0, options.label, {
      fontFamily: "Anuphan, Syne, sans-serif",
      fontSize: "22px",
      fontStyle: "700",
      color: "#06120f",
    })
    .setOrigin(0.5);

  container.add([bg, border, label]);
  container.setSize(width, height);
  bg.setInteractive({ useHandCursor: true });

  bg.on("pointerover", () => {
    bg.setFillStyle(0xe8fff4, 1);
    scene.tweens.add({
      targets: container,
      scale: 1.04,
      duration: 140,
      ease: "Sine.easeOut",
    });
  });

  bg.on("pointerout", () => {
    bg.setFillStyle(fill, 1);
    scene.tweens.add({
      targets: container,
      scale: 1,
      duration: 140,
      ease: "Sine.easeOut",
    });
  });

  bg.on("pointerdown", () => {
    scene.tweens.add({
      targets: container,
      scale: 0.97,
      duration: 80,
      yoyo: true,
      onComplete: options.onClick,
    });
  });

  return container;
}
