import 'phaser';

import debugCode from "../debug-code.ts";
import FishgirlScene from "../fishgirl-scene.ts";
import {AdventureStory} from "../adventure-story.ts";
import {Paths} from "../adventure.ts";
import ItemSprite from "../item-sprite.ts";

export default class Tunnel extends FishgirlScene {
    tunnelInvestigated!: boolean
    leviathanGateway!: ItemSprite
    coyolisBackDoor!: ItemSprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        let paths: Paths = {
            locations: {
                'entrance': new Phaser.Math.Vector2(0, 725),
                'door': new Phaser.Math.Vector2(1000, 720),
                'end': new Phaser.Math.Vector2(1350, 715)
            },
            paths: {
                'left': ['entrance', 'door'],
                'right': ['door', 'end']
            }
        }
        super(config, "Tunnel", "Hidden behind Co'yoli's\n\nVa'weál\nDartfrog 5762", paths);
    }

    init(data: { inventory?: string[], tunnelInvestigated?: boolean }) {
        super.init(data);
        this.tunnelInvestigated = data.tunnelInvestigated || false;
    }

    get story(): AdventureStory<this> {
        return {
            states: {}
        };
    }

    setupNextLoader() {}

    create() {
        super.create()

        this.leviathanGateway = new ItemSprite(
            this,
            {
                itemName: 'leviathan-gateway',
                x: 1200,
                y: 520
            }
        )
        this.add.existing(this.leviathanGateway)

        this.coyolisBackDoor = new ItemSprite(
            this,
            {
                itemName: 'con-coyolis-tunnel-door',
                x: 100,
                y: 625
            }
        )
        this.add.existing(this.coyolisBackDoor)

        this.createFishgirl(this.w / 2, this.h / 2)

        debugCode("c", this, () => this.gotoScene('restaurant', { tunnelInvestigated: this.tunnelInvestigated }, true))
    }
}
