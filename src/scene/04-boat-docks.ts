import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";

let initialNotInvestigated = {
    setup(scene: BoatDocks) {
        scene.conCoyolis.sparkle = true
        scene.lectureHall.sparkle = true
    },
    teardown(_scene: BoatDocks) {

    }
}

let initialInvestigated = {
    setup(scene: BoatDocks) {
        scene.conCoyolis.sparkle = true
        scene.lectureHall.sparkle = true
    },
    teardown(_scene: BoatDocks) {

    }
}

export default class BoatDocks extends FishgirlScene {
    tunnelInvestigated!: boolean
    conCoyolis!: ItemSprite
    lectureHall!: ItemSprite

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

    init(data: { inventory?: string[], tunnelInvestigated?: boolean }) {
        super.init(data);
        this.tunnelInvestigated = data.tunnelInvestigated || false;
    }

    get story(): AdventureStory<this> {
        return {
            states: {
                initialNotInvestigated,
                initialInvestigated,
            }
        };
    }

    setupNextLoader() {
        this.load.sceneModule('restaurant', () => import('./05-restaurant.ts'))
        this.load.sceneModule('lecture-hall', () => import('./07-lecture-hall.ts'))
    }

    create() {
        super.create()

        this.conCoyolis = new ItemSprite(
            this,
            {
                itemName: 'con-coyolis',
                x: 225,
                y: 620,
            }
        )
        this.add.existing(this.conCoyolis)

        this.lectureHall = new ItemSprite(
            this,
            {
                itemName: 'lecture-hall',
                x: 1215,
                y: 620,
            }
        )
        this.add.existing(this.lectureHall)

        this.createFishgirl(this.w / 2, this.h / 2)
        this.gotoState(this.tunnelInvestigated ? 'initialInvestigated' : 'initialNotInvestigated')

        debugCode("x", this, () => this.gotoScene('restaurant', { tunnelInvestigated: this.tunnelInvestigated }, true))
        debugCode("c", this, () => this.gotoScene('lecture-hall', undefined, true))
    }
}
