import 'phaser';

import debugCode from "../debug-code.ts";
import ItemSprite from "../item-sprite.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";

export default class DartfrogEra extends FishgirlScene {
    guy!: ItemSprite
    docks!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Dartfrog\nYear 5762");
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        }
    }

    setupNextLoader() {
        this.load.sceneModule('boat-docks', () => import('./04-boat-docks.ts'))
    }

    create() {
        super.create()

        this.docks = new ItemSprite(
            this,
            {
                itemName: 'docks',
                x: (this.w * 0.75) * (1 / 4),
                y: this.h / 4
            }
        )
        this.add.existing(this.docks)

        this.guy = new ItemSprite(
            this,
            {
                itemName: 'guy',
                x: ((this.w * 0.75) / 2),
                y: this.h * 3 / 4,
                originX: 0.5,
                originY: 1.0
            }
        )
        this.add.existing(this.guy)

        this.createFishgirl((this.w * 0.75) / 2 + (2 * this.guy.itemImg.width), this.h * (3 / 4))

        debugCode("x", this, () => this.gotoScene('boat-docks', undefined, true))
    }
}
