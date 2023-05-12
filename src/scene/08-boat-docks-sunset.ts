import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";

export default class BoatDocksSunset extends FishgirlScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        };
    }

    setupNextLoader() {
        this.load.sceneModule('outro', () => import('./09-outro.ts'))
    }

    create() {
        super.create()

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("x", this, () => this.gotoScene('outro', undefined, true))
    }
}
