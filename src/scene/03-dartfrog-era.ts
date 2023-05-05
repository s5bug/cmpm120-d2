import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";
import ItemSprite from "../item-sprite.ts";

import BoatDocksScene from "./04-boat-docks.ts?url";

export default class DartfrogEra extends AdventureScene {
    guy!: ItemSprite
    fishgirl!: ItemSprite
    docks!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Dartfrog\nYear 5762");
    }

    setupNextLoader() {
        // @ts-ignore
        this.load.sceneModule('boat-docks', BoatDocksScene)
    }

    create() {
        super.create()

        this.guy = new ItemSprite(
            this,
            'guy',
            ((this.w * 0.75) / 2),
            this.h * 3 / 4
        )
        this.add.existing(this.guy)

        this.fishgirl = new ItemSprite(
            this,
            'fishgirl',
            0,
            this.h * 3 / 4
        )
        this.fishgirl.x =
            ((this.w * 0.75) / 2) - (this.fishgirl.itemImg.width + this.guy.itemImg.width)
        this.add.existing(this.fishgirl)

        this.docks = new ItemSprite(
            this,
            'docks',
            (this.w * 0.75) * (1 / 4),
            this.h / 4
        )
        this.add.existing(this.docks)

        debugCode("x", this, () => this.gotoScene('boat-docks', undefined, true))
    }
}
