import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";

export default class BoatDocksSunset extends FishgirlScene {
    guy!: ItemSprite
    personageA!: ItemSprite
    personageB!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'con_entrance': new Phaser.Math.Vector2(225, 750),
                'con_steps': new Phaser.Math.Vector2(225, 900),
                'lecture_steps': new Phaser.Math.Vector2(1215, 900),
                'lecture_entrance': new Phaser.Math.Vector2(1215, 750)
            },
            paths: {
                'con_steps': ['con_steps', 'con_entrance'],
                'lecture_steps': ['lecture_steps', 'lecture_entrance']
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
        this.load.sceneModule('outro', () => import('./09-outro.ts'))
    }

    create() {
        super.create()

        this.guy = new ItemSprite(
            this,
            {
                itemName: 'guy',
                x: 225,
                y: 750,
                originX: 0.5,
                originY: 1.0
            }
        )
        this.add.existing(this.guy)

        this.personageA = new ItemSprite(
            this,
            {
                itemName: 'personage-a',
                x: 225,
                y: 900,
                originX: 0.5,
                originY: 1.0
            }
        )
        this.add.existing(this.personageA)

        this.personageB = new ItemSprite(
            this,
            {
                itemName: 'personage-b',
                x: 1215,
                y: 750,
                originX: 0.5,
                originY: 1.0
            }
        )
        this.add.existing(this.personageB)

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("x", this, () => this.gotoScene('outro', undefined, true))
    }
}
