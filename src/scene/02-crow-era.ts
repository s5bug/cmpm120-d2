import 'phaser';

import AdventureScene from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";
import debugCode from "../debug-code.ts";

export default class CrowEra extends AdventureScene {
    loadDartfrog!: Promise<void>
    soccerBall!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Crow\nYear 978");
    }

    create() {
        super.create()

        this.loadDartfrog = import('./03-dartfrog-era.ts').then(dartfrogModule => {
            this.game.scene.add('dartfrog-era', dartfrogModule.default)
        })

        this.soccerBall = new ItemSprite(
            this,
            'soccer-ball',
            this.w / 2,
            this.h / 2,
        )
        this.add.existing(this.soccerBall)

        debugCode(this, () => this.loadDartfrog.then(() => this.scene.start('dartfrog-era')))
    }
}
