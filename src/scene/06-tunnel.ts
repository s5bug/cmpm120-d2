import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class Tunnel extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Tunnel", "Hidden behind Co'yoli's\n\nVa'weál\nDartfrog 5762");
    }

    setupNextLoader() {}

    create() {
        super.create();

        debugCode("c", this, () => this.gotoScene('restaurant', undefined, true))
    }
}
