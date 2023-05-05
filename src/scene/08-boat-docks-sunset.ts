import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class BoatDocksSunset extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    setupNextLoader() {
        this.load.sceneModule('outro', () => import('./09-outro.ts'))
    }

    create() {
        super.create();

        debugCode("x", this, () => this.gotoScene('outro', undefined, true))
    }
}
