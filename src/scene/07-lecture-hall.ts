import 'phaser';

import debugCode from "../debug-code.ts";
import {AdventureStory} from "../adventure-story.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {Paths} from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";

export default class LectureHall extends FishgirlScene {
    personageB!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'entrance': new Phaser.Math.Vector2(0, 650),
                'first_row': new Phaser.Math.Vector2(280, 650),
                'first_row_top': new Phaser.Math.Vector2(300, 300),
                'second_row': new Phaser.Math.Vector2(580, 800),
                'second_row_top': new Phaser.Math.Vector2(590, 450),
                'third_row': new Phaser.Math.Vector2(880, 950),
                'third_row_top': new Phaser.Math.Vector2(880, 600),
                'end': new Phaser.Math.Vector2(1200, 950)
            },
            paths: {
                'left': ['entrance', 'first_row'],
                'into_first': ['first_row', 'first_row_top'],
                'down_second': ['first_row', 'second_row'],
                'into_second': ['second_row', 'second_row_top'],
                'down_third': ['second_row', 'third_row'],
                'into_third': ['third_row', 'third_row_top'],
                'right': ['third_row', 'end']
            }
        }
        super(config, "Lecture Hall", "Va'weál\nDartfrog 5762", paths);
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

        this.personageB = new ItemSprite(
            this,
            {
                itemName: 'personage-b',
                x: 1150,
                y: 760,
            }
        )
        this.add.existing(this.personageB)

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("x", this, () => this.gotoScene('boat-docks-sunset', undefined, true))
    }
}
