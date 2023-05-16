import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";

export default class Tunnel extends FishgirlScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'entrance': new Phaser.Math.Vector2(0, 725),
                'door': new Phaser.Math.Vector2(1000, 720),
                'end': new Phaser.Math.Vector2(1350, 715)
            },
            paths: {
                'left': ['entrance', 'door'],
                'right': ['door', 'end']
            }
        }
        super(config, "Tunnel", "Hidden behind Co'yoli's\n\nVa'weál\nDartfrog 5762", paths);
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
