import 'phaser';

import debugCode from "../debug-code.ts";
import {AdventureStory} from "../adventure-story.ts";
import FishgirlScene from "../fishgirl-scene.ts";

export default class LectureHall extends FishgirlScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Lecture Hall", "Va'weál\nDartfrog 5762");
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        };
    }

    setupNextLoader() {
        this.load.sceneModule('boat-docks-sunset', () => import('./08-boat-docks-sunset.ts'))
    }

    create() {
        super.create()

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("x", this, () => this.gotoScene('boat-docks-sunset', undefined, true))
    }
}
