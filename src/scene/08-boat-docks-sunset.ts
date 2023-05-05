import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

import OutroScene from "./09-outro.ts?url";

export default class BoatDocksSunset extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    setupNextLoader() {
        // @ts-ignore
        this.load.sceneModule('outro', OutroScene)
    }

    create() {
        super.create();

        debugCode("x", this, () => this.gotoScene('outro', undefined, true))
    }
}
