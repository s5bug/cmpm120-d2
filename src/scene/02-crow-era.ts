import 'phaser';

import AdventureScene, { Paths } from "../adventure.ts";
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
        let paths: Paths = {
            locations: {
                "left": new Phaser.Math.Vector2(0, 816),
                "right": new Phaser.Math.Vector2(0, 816),
            },
            paths: {
                "forward": ["left", "right"],
                "backward": ["right", "left"]
            }
        }
        super(config, "Va\'weál", "Era of The Crow\nYear 978", paths);
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

        this.fishgirl.itemImg.play('fishgirl-idle')
        this.fishgirl.itemImg.on(Phaser.Input.Events.POINTER_OVER, (ev: PointerEvent) => {
            ev;
            this.fishgirl.sparkler.active = !this.fishgirl.sparkler.active
            if(this.fishgirl.sparkler.active) {
                this.fishgirl.sparkler.emitParticle(2)
            } else {
                this.fishgirl.sparkler.killAll()
            }
        })

        this.input.on(Phaser.Input.Events.POINTER_MOVE, (ev: PointerEvent) => {
            let dw = this.fishgirl.itemImg.width
            let fgl = this.fishgirl.x - dw
            let fgr = this.fishgirl.x + dw
            if(ev.x < fgl) {
                if(this.fishgirl.itemImg.anims.getName() != 'fishgirl-left')
                    this.fishgirl.itemImg.play('fishgirl-left')
            } else if(ev.x > fgr) {
                if(this.fishgirl.itemImg.anims.getName() != 'fishgirl-right')
                    this.fishgirl.itemImg.play('fishgirl-right')
            } else {
                if(this.fishgirl.itemImg.anims.getName() != 'fishgirl-idle')
                    this.fishgirl.itemImg.play('fishgirl-idle')
            }
        })

        let mcPathfind: Phaser.Tweens.Tween | undefined = undefined
        this.input.on(Phaser.Input.Events.POINTER_DOWN, (ev: PointerEvent) => {
            mcPathfind?.stop()
            mcPathfind = this.pathfind(this.fishgirl, new Phaser.Geom.Point(ev.x, ev.y))
        })

        debugCode("x", this, () => this.gotoScene('dartfrog-era', undefined, true))
    }
}
