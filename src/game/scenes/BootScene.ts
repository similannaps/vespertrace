import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#05040a");
    const fontsReady =
      "fonts" in document ? document.fonts.ready : Promise.resolve();

    void fontsReady.then(() => {
      this.scene.start("TitleScene");
    });
  }
}
