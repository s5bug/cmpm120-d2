import 'phaser';
import ItemSprite from "./item-sprite.ts";
import Progresser from "./progresser.ts";

export type Paths =  {
    locations: Record<string, Phaser.Math.Vector2>,
    paths: Record<string, [string, string]>,
}

export default abstract class AdventureScene extends Progresser {
    name: string
    subtitle: string | undefined
    paths: Paths
    inventory!: string[]
    transitionDuration!: number
    w!: number
    h!: number
    s!: number
    messageBox!: Phaser.GameObjects.Text
    inventoryBanner!: Phaser.GameObjects.Text
    inventoryItems!: ItemSprite[]

    init(data: { inventory?: string[] }) {
        this.inventory = data.inventory || [];
    }

    protected constructor(config: Phaser.Types.Scenes.SettingsConfig, name: string, subtitle?: string, paths?: Paths) {
        super(config);
        this.name = name;
        this.subtitle = subtitle;
        this.paths = paths || { locations: {}, paths: {} };
    }

    create() {
        super.create()

        this.transitionDuration = 1000;

        this.w = this.game.config.width as number;
        this.h = this.game.config.height as number;
        this.s = this.w * 0.01;

        this.cameras.main.setBackgroundColor('#444');
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.rectangle(this.w * 0.75, 0, this.w * 0.25, this.h).setOrigin(0, 0).setFillStyle(0);
        let titleText = this.add.text(this.w * 0.75 + this.s, this.s, this.name)
            .setStyle({ fontSize: `${3 * this.s}px` })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        if(this.subtitle) {
            this.add.text(this.w * 0.75 + this.s, titleText.y + titleText.height + this.s, this.subtitle)
                .setStyle({ fontSize: `${2 * this.s}px`, color: "#AAAAAA" })
                .setWordWrapWidth(this.w * 0.25 - 2 * this.s)
        }

        this.messageBox = this.add.text(this.w * 0.75 + this.s, this.h * 0.33, "")
            .setStyle({ fontSize: `${2 * this.s}px`, color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.inventoryBanner = this.add.text(this.w * 0.75 + this.s, this.h * 0.66, "")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setText("Inventory")
            .setAlpha(0);

        this.inventoryItems = [];
        this.updateInventory();

        this.add.text(this.w-3*this.s, this.h-3*this.s, "📺")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.showMessage('Fullscreen?'))
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });

        if(new URL(window.location.href).searchParams.get("debug") == "true") {
            let debugText = this.add.text(0, 0, "(?, ?)")
            debugText.setOrigin(0, 0)
            debugText.depth = Infinity
            this.input.on(Phaser.Input.Events.POINTER_MOVE, (ev: PointerEvent) => {
                debugText.text = `(${ev.x}, ${ev.y})`
            })
        }
    }

    showMessage(message: string) {
        this.messageBox.setText(message);
        this.tweens.add({
            targets: this.messageBox,
            alpha: { from: 1, to: 0 },
            easing: 'Quintic.in',
            duration: 4 * this.transitionDuration
        });
    }

    updateInventory() {
        if (this.inventory.length > 0) {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 1,
                duration: this.transitionDuration
            });
        } else {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 0,
                duration: this.transitionDuration
            });
        }
        if (this.inventoryItems) {
            this.inventoryItems.forEach((i) => i.destroy());
        }
        this.inventoryItems = [];
        let h = this.h * 0.66 + 3 * this.s;
        this.inventory.forEach((e: string) => {
            let item = new ItemSprite(this, e, this.w * 0.75 + 2 * this.s, h, 'inventory')
            item.itemImg.scale = (item.itemTxt.height / item.itemImg.height)
            this.add.existing(item)

            h += item.itemTxt.height + this.s;

            this.inventoryItems.push(item)
        });
    }

    hasItem(item: string) {
        return this.inventory.includes(item);
    }

    gainItem(itemName: string) {
        if (this.inventory.includes(itemName)) {
            console.warn('gaining item already held:', itemName);
            return;
        }
        this.inventory.push(itemName);
        this.updateInventory();
        for (let item of this.inventoryItems) {
            if (item.itemName == itemName) {
                this.tweens.add({
                    targets: item,
                    x: { from: item.x - 20, to: item.x },
                    alpha: { from: 0, to: 1 },
                    ease: 'Cubic.out',
                    duration: this.transitionDuration
                });
            }
        }
    }

    loseItem(itemName: string) {
        if (!this.inventory.includes(itemName)) {
            console.warn('losing item not held:', itemName);
            return;
        }
        for (let item of this.inventoryItems) {
            if (item.itemName == itemName) {
                this.tweens.add({
                    targets: item,
                    x: { from: item.x, to: item.x + 20 },
                    alpha: { from: 1, to: 0 },
                    ease: 'Cubic.in',
                    duration: this.transitionDuration
                });
            }
        }
        this.time.delayedCall(500, () => {
            this.inventory = this.inventory.filter((e) => e != itemName);
            this.updateInventory();
        });
    }

    gotoScene(key: string, data?: object | undefined, fast?: boolean) {
        super.gotoScene(key, { inventory: this.inventory, ...data }, fast)
    }

    beforeSceneSwitch(key: string, fast: boolean): void | Promise<void> {
        key;
        if(fast) {
            return
        } else {
            return new Promise(resolve => {
                this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
                this.time.delayedCall(this.transitionDuration, () => {
                    resolve()
                })
            })
        }
    }

    pathfind(thing: Phaser.GameObjects.Components.Transform, to: Phaser.Types.Math.Vector2Like): Phaser.Tweens.Tween | undefined {
        let closestPoint = (a: Phaser.Geom.Line, c: Phaser.Types.Math.Vector2Like): Phaser.Math.Vector2 => {
            let onInfinite = Phaser.Geom.Line.GetNearestPoint(a, c)
            let length = Phaser.Geom.Line.Length(a)

            let distanceA = a.getPointA().distance(onInfinite)
            let distanceB = a.getPointB().distance(onInfinite)

            if(Math.abs(distanceA + distanceB - length) < Phaser.Math.EPSILON) {
                return new Phaser.Math.Vector2(onInfinite)
            } else if(distanceA > distanceB) {
                return a.getPointB()
            } else {
                return a.getPointA()
            }
        }

        type Closest = { distance: number, pathName: string }
        let closestNow: Closest | undefined = undefined
        for(let pathName in this.paths.paths) {
            let path = this.paths.paths[pathName]
            let segment = new Phaser.Geom.Line(
                this.paths.locations[path[0]].x,
                this.paths.locations[path[0]].y,
                this.paths.locations[path[1]].x,
                this.paths.locations[path[1]].y
            )
            let point = closestPoint(segment, thing)
            let closeness = { distance: point.distance(thing), pathName: pathName }
            if(!closestNow || closestNow.distance < closeness.distance) {
                closestNow = closeness
            }
        }
        if(closestNow != undefined) {
            // TODO
            to;
            return undefined
        } else {
            return undefined
        }
    }
}
