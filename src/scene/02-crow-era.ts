import 'phaser';

import { Paths } from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";
import debugCode from "../debug-code.ts";
import {AdventureStory} from "../adventure-story.ts";
import FishgirlScene from "../fishgirl-scene.ts";

const tutorialState = {
    soccerballClick(scene: CrowEra) {
        scene.inCutscene = true

        scene.soccerBall.sparkle = false
        let rightOfSoccerBall = new Phaser.Math.Vector2(
            scene.soccerBall.x + scene.soccerBall.itemImg.width,
            scene.soccerBall.y
        )
        scene.pathfindFishgirl(rightOfSoccerBall, true)
        scene.fishgirlPathfinder!.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            scene.soccerBall.destroy()
            scene.gainItem('soccer-ball')
            scene.fishgirl.itemImg.play('fishgirl-left')
            scene.gotoState('guySurprisedCutscene')
        })
    },
    setup(scene: CrowEra) {
        scene.soccerBall.sparkle = true
        scene.soccerBall.itemImg.once(Phaser.Input.Events.POINTER_DOWN, () => this.soccerballClick(scene))
    },
    teardown(_scene: CrowEra) {

    }
}

const guySurprisedCutscene = {
    setup(scene: CrowEra) {
        scene.tweens.chain({
            targets: scene.guy,
            tweens: [
                scene.speechTween(
                    4000,
                    "Hey, that's my soccer ball! I thought I was going to be the only one here, so I brought it to pass the time.",
                    FishgirlScene.GUY_SPEECH_COLOR
                ),
                scene.speechTween(
                    4000,
                    "You wouldn't happen to be here on a journey to the past, would you?",
                    FishgirlScene.GUY_SPEECH_COLOR,
                    {
                        delayEnding: false,
                        onComplete: () => scene.gotoState('toTheRiver')
                    }
                )
            ],
        })
    },
    teardown(scene: CrowEra) {
        scene.inCutscene = false
    }
}

const toTheRiver = {
    riverOfTimeClick(scene: CrowEra) {
        scene.inCutscene = true

        scene.riverOfTime.sparkle = false
        scene.pathfindFishgirl(scene.riverOfTime, true)
        scene.fishgirlPathfinder!.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            scene.gotoScene('dartfrog-era')
        })
    },
    setup(scene: CrowEra) {
        scene.riverOfTime.sparkle = true
        scene.riverOfTime.itemImg.once(Phaser.Input.Events.POINTER_DOWN, () => this.riverOfTimeClick(scene))
    },
    teardown(_scene: CrowEra) { throw new Error("unreachable"); }
}

export default class CrowEra extends FishgirlScene {
    background!: Phaser.GameObjects.Sprite
    sun!: Phaser.GameObjects.Sprite
    backLayer!: Phaser.GameObjects.Sprite
    middleLayer!: Phaser.GameObjects.Sprite
    soccerBall!: ItemSprite
    guy!: ItemSprite
    riverOfTime!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                "left": new Phaser.Math.Vector2(0, 820),
                "right": new Phaser.Math.Vector2(1440, 820),
            },
            paths: {
                "ground": ["left", "right"]
            }
        }
        super(config, "Va\'weál", "Era of The Crow\nYear 978", paths);
    }

    get story(): AdventureStory<this> {
        return {
            states: {
                tutorialState,
                guySurprisedCutscene,
                toTheRiver
            }
        };
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
            {
                itemName: 'river-of-time',
                x: 1325,
                y: 640,
                textSide: 'left'
            }
        )
        this.add.existing(this.riverOfTime)

        this.middleLayer = this.add.sprite(
            0,
            16,
            'crow-era-middle-layer'
        )
        this.middleLayer.setOrigin(0, 0)

        this.soccerBall = new ItemSprite(
            this,
            {
                itemName: 'soccer-ball',
                x: (this.w * 0.75) / 2,
                y: this.h * 3 / 4
            }
        )
        this.add.existing(this.soccerBall)

        this.guy = new ItemSprite(
            this,
            {
                itemName: 'guy',
                x: 0,
                y: standLine,
                originX: 0.5,
                originY: 1.0
            }
        )
        this.guy.x =
            ((this.w * 0.75) / 2) - (this.soccerBall.itemImg.width + this.guy.itemImg.width)
        this.add.existing(this.guy)

        this.createFishgirl(176, standLine)
        this.gotoState("tutorialState")

        debugCode("x", this, () => this.gotoScene('dartfrog-era', undefined, true))
    }
}
