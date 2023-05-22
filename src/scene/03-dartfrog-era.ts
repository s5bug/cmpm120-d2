import 'phaser';

import debugCode from "../debug-code.ts";
import ItemSprite from "../item-sprite.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";

let explore = {
    guyClick(scene: DartfrogEra) {
        scene.inCutscene = true

        scene.guy.sparkle = false
        let rightOfGuy = new Phaser.Math.Vector2(
            scene.guy.x + 70,
            scene.guy.y
        )
        scene.pathfindFishgirl(rightOfGuy, true)
        scene.fishgirlPathfinder!.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            scene.fishgirl.itemImg.play('fishgirl-left')
            scene.gotoState('firstDialogue')
        })
    },
    setup(scene: DartfrogEra) {
        scene.guy.sparkle = true
        scene.guy.itemImg.once(Phaser.Input.Events.POINTER_DOWN, () => this.guyClick(scene))
    },
    teardown(_scene: DartfrogEra) {

    }
}

let firstDialogue = {
    setup(scene: DartfrogEra) {
        scene.tweens.chain({
            targets: scene.guy,
            tweens: [
                scene.speechTween(
                    3000,
                    "Wow, we actually made it to the past!",
                    FishgirlScene.GUY_SPEECH_COLOR
                ),
                scene.speechTween(
                    4000,
                    "Look at all the water here! This must have been what it was like before the world was flooded by Leviathan...",
                    FishgirlScene.GUY_SPEECH_COLOR,
                    {
                        onComplete: () => scene.gotoState('secondDialogue')
                    }
                )
            ],
        })
    },
    teardown(_scene: DartfrogEra) {

    }
}

let secondDialogue = {
    setup(scene: DartfrogEra) {
        scene.pathfind(scene.guy, scene.docks, FishgirlScene.GUY_SPEED)!.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            scene.tweens.chain({
                targets: scene.guy,
                tweens: [
                    scene.speechTween(
                        4000,
                        "It looks like there's a town across these docks.",
                        FishgirlScene.GUY_SPEECH_COLOR
                    ),
                    scene.speechTween(
                        4000,
                        "Let's go!",
                        FishgirlScene.GUY_SPEECH_COLOR,
                        {
                            delayEnding: false,
                            onComplete: () => scene.gotoState('readyToBoatDocks')
                        }
                    )
                ],
            })
        })
    },
    teardown(scene: DartfrogEra) {
        scene.inCutscene = false
        scene.guy.destroy()
    }
}

let readyToBoatDocks = {
    docksClick(scene: DartfrogEra) {
        scene.inCutscene = true

        scene.docks.sparkle = false
        scene.pathfindFishgirl(scene.docks, true)
        scene.fishgirlPathfinder!.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            scene.gotoScene('boat-docks')
        })
    },
    setup(scene: DartfrogEra) {
        scene.docks.sparkle = true
        scene.docks.itemImg.once(Phaser.Input.Events.POINTER_DOWN, () => this.docksClick(scene))
    },
    teardown(_scene: DartfrogEra) { throw new Error("unreachable") }
}

export default class DartfrogEra extends FishgirlScene {
    guy!: ItemSprite
    docks!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'close_left': new Phaser.Math.Vector2(0, 940),
                'close_left_int': new Phaser.Math.Vector2(500, 940),
                'close_right_int': new Phaser.Math.Vector2(940, 940),
                'close_right': new Phaser.Math.Vector2(1440, 940),
                'far_left': new Phaser.Math.Vector2(0, 500),
                'far_left_int': new Phaser.Math.Vector2(350, 500),
                'far_right_int': new Phaser.Math.Vector2(1090, 500),
                'far_right': new Phaser.Math.Vector2(1440, 500)
            },
            paths: {
                'close_left': ['close_left', 'close_left_int'],
                'close_middle': ['close_left_int', 'close_right_int'],
                'close_right': ['close_right_int', 'close_right'],
                'left_to_far': ['close_left_int', 'far_left_int'],
                'right_to_far': ['close_right_int', 'far_right_int'],
                'far_left': ['far_left', 'far_left_int'],
                'far_right': ['far_right_int', 'far_right']
            }
        }
        super(config, "Va\'weál", "Era of The Dartfrog\nYear 5762", paths);
    }

    get story(): AdventureStory<this> {
        return {
            states: {
                explore,
                firstDialogue,
                secondDialogue,
                readyToBoatDocks
            }
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
        this.gotoState('explore')

        debugCode("x", this, () => this.gotoScene('boat-docks', undefined, true))
    }
}
