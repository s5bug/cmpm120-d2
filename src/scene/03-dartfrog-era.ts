import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";
import ItemSprite from "../item-sprite.ts";

export default class DartfrogEra extends AdventureScene {
    guy!: ItemSprite
    fishgirl!: ItemSprite
    docks!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Dartfrog\nYear 5762");
    }

    setupNextLoader() {
        this.load.sceneModule('boat-docks', () => import('./04-boat-docks.ts'))
    }

    create() {
        super.create()

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

        this.fishgirl = new ItemSprite(
            this,
            {
                itemName: 'fishgirl',
                x: 0,
                y: this.h * 3 / 4,
                originX: 0.5,
                originY: 1.0
            },
        )
        this.fishgirl.x =
            ((this.w * 0.75) / 2) - (this.fishgirl.itemImg.width + this.guy.itemImg.width)
        this.add.existing(this.fishgirl)

        this.docks = new ItemSprite(
            this,
            {
                itemName: 'docks',
                x: (this.w * 0.75) * (1 / 4),
                y: this.h / 4
            }
        )
        this.add.existing(this.docks)

        debugCode("x", this, () => this.gotoScene('boat-docks', undefined, true))
    }
}
