import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";

export default class Restaurant extends FishgirlScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'left': new Phaser.Math.Vector2(0, 800),
                'right': new Phaser.Math.Vector2(1215, 800)
            },
            paths: {
                'floor': ['left', 'right']
            }
        }
        super(config, "Co'n Co'yoli's", "Authentic Acuerlan cuisine\n\nVa'weál\nDartfrog 5762", paths);
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        };
    }

    setupNextLoader() {
        this.load.sceneModule('tunnel', () => import('./06-tunnel.ts'))
    }

    create() {
        super.create()

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("x", this, () => this.gotoScene('tunnel', undefined, true))
        debugCode("c", this, () => this.gotoScene('boat-docks', undefined, true))
    }
}
