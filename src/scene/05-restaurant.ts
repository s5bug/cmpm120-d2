import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";

let initialNotInvestigated = {
    setup(scene: Restaurant) {
        scene.exitDoor.sparkle = true
        scene.tunnelDoor.sparkle = true

        scene.personageA.sparkle = true
    },
    teardown(_scene: Restaurant) {

    }
}

let initialInvestigated = {
    setup(scene: Restaurant) {
        scene.exitDoor.sparkle = true
        scene.tunnelDoor.sparkle = true
    },
    teardown(_scene: Restaurant) {

    }
}

export default class Restaurant extends FishgirlScene {
    tunnelInvestigated!: boolean
    exitDoor!: ItemSprite
    tunnelDoor!: ItemSprite
    personageA!: ItemSprite
    personageB!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'left': new Phaser.Math.Vector2(0, 800),
                'right': new Phaser.Math.Vector2(1215, 800)
            },
            paths: {
                'floor': ['left', 'right']
            }
        }
        super(config, "Co'n Co'yoli's", "Authentic Acuerlan cuisine\n\nVa'weál\nDartfrog 5762", paths);
    }

    init(data: { inventory?: string[], tunnelInvestigated?: boolean }) {
        super.init(data);
        this.tunnelInvestigated = data.tunnelInvestigated || false;
    }

    get story(): AdventureStory<this> {
        return {
            states: {
                initialNotInvestigated,
                initialInvestigated
            }
        };
    }

    setupNextLoader() {
        this.load.sceneModule('tunnel', () => import('./06-tunnel.ts'))
    }

    create() {
        super.create()

        this.exitDoor = new ItemSprite(
            this,
            {
                itemName: 'con-coyolis-exit-door',
                x: 100,
                y: 700
            }
        )
        this.add.existing(this.exitDoor)

        this.tunnelDoor = new ItemSprite(
            this,
            {
                itemName: 'con-coyolis-tunnel-door',
                x: 1115,
                y: 700
            }
        )
        this.add.existing(this.tunnelDoor)

        this.personageA = new ItemSprite(
            this,
            {
                itemName: 'personage-a',
                x: 500,
                y: 600,
                originX: 0.5,
                originY: 1.0,
            }
        )
        if(!this.tunnelInvestigated) this.add.existing(this.personageA)

        this.personageB = new ItemSprite(
            this,
            {
                itemName: 'personage-b',
                x: 570,
                y: 600,
                originX: 0.5,
                originY: 1.0
            }
        )
        if(!this.tunnelInvestigated) this.add.existing(this.personageB)

        this.createFishgirl(this.w / 2, this.h / 2)
        this.gotoState(this.tunnelInvestigated ? 'initialInvestigated' : 'initialNotInvestigated')

        debugCode("x", this, () => this.gotoScene('tunnel', undefined, true))
        debugCode("c", this, () => this.gotoScene('boat-docks', undefined, true))
    }
}
