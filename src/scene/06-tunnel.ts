import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";

export default class Tunnel extends FishgirlScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Tunnel", "Hidden behind Co'yoli's\n\nVa'weál\nDartfrog 5762");
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        };
    }

    setupNextLoader() {}

    create() {
        super.create()

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("c", this, () => this.gotoScene('restaurant', undefined, true))
    }
}
