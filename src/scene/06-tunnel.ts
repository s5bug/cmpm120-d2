import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class Tunnel extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "The Tunnel", "Hidden behind Co'yoli's\n\nVa'weál\nDartfrog 5762");
    }

    create() {
        super.create();

        debugCode("c", this, () => this.scene.start('restaurant'))
    }
}
