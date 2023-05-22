import AdventureScene, {Paths} from "./adventure.ts";
import ItemSprite from "./item-sprite.ts";

export default abstract class FishgirlScene extends AdventureScene {
    inCutscene: boolean
    fishgirl!: ItemSprite
    fishgirlPathfinder: Phaser.Tweens.TweenChain | undefined
    static FISHGIRL_SPEECH_COLOR: string = "#9aebe4"
    static FISHGIRL_SPEED: number = 0.75;
    static GUY_SPEECH_COLOR: string = "#eeeeaa"
    static GUY_SPEED: number = 0.7;

    protected constructor(config: Phaser.Types.Scenes.SettingsConfig, name: string, subtitle?: string, paths?: Paths) {
        super(config, name, subtitle, paths);
        this.inCutscene = false
    }

    createFishgirl(x: number, y: number): void {
        this.fishgirl = new ItemSprite(
            this,
            {
                itemName: 'fishgirl',
                x: x,
                y: y,
                originX: 0.5,
                originY: 1.0
            }
        )
        this.add.existing(this.fishgirl)
        this.fishgirl.itemImg.play('fishgirl-idle')

        this.input.on(Phaser.Input.Events.POINTER_MOVE, (ev: Phaser.Input.Pointer) => {
            if(this.inCutscene) return

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

        this.input.on(Phaser.Input.Events.POINTER_DOWN, (ev: Phaser.Input.Pointer) => {
            this.pathfindFishgirl(ev)
        })
    }

    pathfindFishgirl(to: Phaser.Types.Math.Vector2Like, asCutscene: boolean = false): void {
        if(asCutscene || !this.inCutscene) {
            this.fishgirlPathfinder?.stop()
            this.fishgirlPathfinder = this.pathfind(this.fishgirl, to, FishgirlScene.FISHGIRL_SPEED)
        }
    }
}
