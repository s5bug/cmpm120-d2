import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";

export default class BoatDocks extends FishgirlScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'con_entrance': new Phaser.Math.Vector2(225, 750),
                'con_steps': new Phaser.Math.Vector2(225, 900),
                'lecture_steps': new Phaser.Math.Vector2(1215, 900),
                'lecture_entrance': new Phaser.Math.Vector2(1215, 750),
                'came_from': new Phaser.Math.Vector2(1440, 900)
            },
            paths: {
                'con_steps': ['con_steps', 'con_entrance'],
                'docks': ['con_steps', 'lecture_steps'],
                'lecture_steps': ['lecture_steps', 'lecture_entrance'],
                'entrance': ['lecture_steps', 'came_from']
            }
        }
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762", paths);
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        };
    }

    setupNextLoader() {
        this.load.sceneModule('restaurant', () => import('./05-restaurant.ts'))
        this.load.sceneModule('lecture-hall', () => import('./07-lecture-hall.ts'))
    }

    create() {
        super.create()

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("x", this, () => this.gotoScene('restaurant', undefined, true))
        debugCode("c", this, () => this.gotoScene('lecture-hall', undefined, true))
    }
}
