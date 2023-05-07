import 'phaser';

import AdventureScene from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";
import debugCode from "../debug-code.ts";

export default class CrowEra extends AdventureScene {
    background!: Phaser.GameObjects.Sprite
    sun!: Phaser.GameObjects.Sprite
    backLayer!: Phaser.GameObjects.Sprite
    middleLayer!: Phaser.GameObjects.Sprite
    soccerBall!: ItemSprite
    guy!: ItemSprite
    riverOfTime!: ItemSprite
    fishgirl!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Crow\nYear 978");
    }

    setupNextLoader() {
        this.load.sceneModule('dartfrog-era', () => import('./03-dartfrog-era.ts'))
    }

    create() {
        super.create()

        this.background = this.add.sprite(
            0,
            0,
            'crow-era-background'
        )
        this.background.setOrigin(0, 0)

        this.sun = this.add.sprite(
            470,
            150,
            'crow-era-sun'
        )
        this.tweens.add({
            targets: this.sun,
            y: 230,
            yoyo: true,
            repeat: -1,
            duration: 3000,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })

        this.backLayer = this.add.sprite(
            0,
            16,
            'crow-era-back-layer'
        )
        this.backLayer.setOrigin(0, 0)

        let standLine = 820

        this.riverOfTime = new ItemSprite(
            this,
            'river-of-time',
            1325,
            640,
            'left',
        )
        this.add.existing(this.riverOfTime)

        this.riverOfTime.itemImg.on('pointerover', () => {
            this.showMessage("A great flowing river. It has been said to send those who wish into the future.")
        })

        this.middleLayer = this.add.sprite(
            0,
            16,
            'crow-era-middle-layer'
        )
        this.middleLayer.setOrigin(0, 0)

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

        this.fishgirl = new ItemSprite(
            this,
            'fishgirl',
            176,
            standLine - (128 / 2)
        )
        this.add.existing(this.fishgirl)

        this.anims.create({
            key: 'fishgirl-idle',
            frameRate: 2,
            frames: this.anims.generateFrameNumbers('fishgirl', { start: 0, end: 1 }),
            repeat: -1
        })

        this.anims.create({
            key: 'fishgirl-right',
            frameRate: 2,
            frames: this.anims.generateFrameNumbers('fishgirl', { start: 2, end: 3 }),
            repeat: -1
        })

        this.anims.create({
            key: 'fishgirl-left',
            frameRate: 2,
            frames: this.anims.generateFrameNumbers('fishgirl', { start: 4, end: 5 }),
            repeat: -1,
        })

        this.fishgirl.itemImg.play('fishgirl-idle')

        this.fishgirl.itemImg.on('pointerover', () => {
            this.showMessage("It me!")
        })

        debugCode("x", this, () => this.gotoScene('dartfrog-era', undefined, true))
    }
}
