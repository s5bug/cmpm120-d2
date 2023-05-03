import 'phaser';

import AdventureScene from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";
import debugCode from "../debug-code.ts";

export default class CrowEra extends AdventureScene {
    loadDartfrog!: Promise<void>
    soccerBall!: ItemSprite
    guy!: ItemSprite
    riverOfTime!: ItemSprite
    fishgirl!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Crow\nYear 978");
    }

    create() {
        super.create()

        if(this.game.scene.getScene('dartfrog-era')) {
            this.loadDartfrog = Promise.resolve()
        } else {
            this.loadDartfrog = import('./03-dartfrog-era.ts').then(dartfrogModule => {
                this.game.scene.add('dartfrog-era', dartfrogModule.default)
            })
        }

        this.soccerBall = new ItemSprite(
            this,
            'soccer-ball',
            (this.w * 0.75) / 2,
            this.h * 3 / 4,
        )
        this.add.existing(this.soccerBall)

        this.guy = new ItemSprite(
            this,
            'guy',
            0,
            this.h * 3 / 4
        )
        this.guy.x =
            ((this.w * 0.75) / 2) - (this.soccerBall.itemImg.width + this.guy.itemImg.width)
        this.add.existing(this.guy)

        this.riverOfTime = new ItemSprite(
            this,
            'river-of-time',
            (this.w * 0.75) * 3 / 4,
            this.h / 4
        )
        this.add.existing(this.riverOfTime)

        this.fishgirl = new ItemSprite(
            this,
            'fishgirl',
            (this.w * 0.75) * (1 / 8),
            this.h * 3 / 4
        )
        this.add.existing(this.fishgirl)

        debugCode("x", this, () => this.loadDartfrog.then(() => this.scene.start('dartfrog-era')))
    }
}
