import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class BoatDocks extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    setupNextLoader() {
        this.load.sceneModule('restaurant', () => import('./05-restaurant.ts'))
        this.load.sceneModule('lecture-hall', () => import('./07-lecture-hall.ts'))
    }

    create() {
        super.create();

        debugCode("x", this, () => this.gotoScene('restaurant', undefined, true))
        debugCode("c", this, () => this.gotoScene('lecture-hall', undefined, true))
    }
}
