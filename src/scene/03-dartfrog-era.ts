import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";
import ItemSprite from "../item-sprite.ts";

export default class DartfrogEra extends AdventureScene {
    loadBoatDocks!: Promise<void>
    guy!: ItemSprite
    fishgirl!: ItemSprite
    docks!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Dartfrog\nYear 5762");
    }

    create() {
        super.create()

        if(this.game.scene.getScene('boat-docks')) {
            this.loadBoatDocks = Promise.resolve()
        } else {
            this.loadBoatDocks = import('./04-boat-docks.ts').then(boatDocksModule => {
                this.game.scene.add('boat-docks', boatDocksModule.default)
            })
        }

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
            ((this.w * 0.75) / 2) - (2 * this.guy.itemImg.width),
            this.h * 3 / 4
        )
        this.add.existing(this.fishgirl)

        this.docks = new ItemSprite(
            this,
            'docks',
            (this.w * 0.75) * (1 / 4),
            this.h / 4
        )
        this.add.existing(this.docks)

        debugCode("x", this, () => this.loadBoatDocks.then(() => this.scene.start('boat-docks')))
    }
}
