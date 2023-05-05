import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

import RestaurantScene from "./05-restaurant.ts?url";
import LectureHallScene from "./07-lecture-hall.ts?url";

export default class BoatDocks extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    setupNextLoader() {
        // @ts-ignore
        this.load.sceneModule('restaurant', RestaurantScene)
        // @ts-ignore
        this.load.sceneModule('lecture-hall', LectureHallScene)
    }

    create() {
        super.create();

        debugCode("x", this, () => this.gotoScene('restaurant', undefined, true))
        debugCode("c", this, () => this.gotoScene('lecture-hall', undefined, true))
    }
}
