import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class LectureHall extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Lecture Hall", "Va'weál\nDartfrog 5762");
    }

    setupNextLoader() {
        this.load.sceneModule('boat-docks-sunset', () => import('./08-boat-docks-sunset.ts'))
    }

    create() {
        super.create();

        debugCode("x", this, () => this.gotoScene('boat-docks-sunset', undefined, true))
    }
}
