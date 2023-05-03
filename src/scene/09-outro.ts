import 'phaser';
import debugCode from "../debug-code.ts";

export default class OutroScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        debugCode("x", this, () => this.scene.start('intro'))
    }

}