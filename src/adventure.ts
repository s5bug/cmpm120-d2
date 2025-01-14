import 'phaser';
import ItemSprite from "./item-sprite.ts";
import Progresser from "./progresser.ts";
import PathGraph from "./path-graph.ts";
import {AdventureState, AdventureStory} from "./adventure-story.ts";

export type Paths =  {
    locations: Record<string, Phaser.Math.Vector2>,
    paths: Record<string, [string, string]>,
}

export default abstract class AdventureScene extends Progresser {
    name: string
    subtitle: string | undefined
    paths: PathGraph<Phaser.Math.Vector2, Phaser.Geom.Line>
    adventureState: AdventureState<this> | undefined
    inventory!: string[]
    transitionDuration!: number
    w!: number
    h!: number
    s!: number
    messageBox!: Phaser.GameObjects.Text
    inventoryBanner!: Phaser.GameObjects.Text
    inventoryItems!: ItemSprite[]

    init(data: { inventory?: string[] }) {
        this.inventory = data.inventory || []
    }

    protected constructor(config: Phaser.Types.Scenes.SettingsConfig, name: string, subtitle?: string, paths?: Paths) {
        super(config)
        this.name = name
        this.subtitle = subtitle
        let nodes: Record<string, Phaser.Math.Vector2> = {}
        let edges: Record<string, [string, string, Phaser.Geom.Line]> = {}

        if(paths) {
            for(let location in paths.locations) {
                nodes[location] = paths.locations[location]
            }
            for(let path in paths.paths) {
                let [a, b] = paths.paths[path]
                let line = new Phaser.Geom.Line(
                    paths.locations[a].x,
                    paths.locations[a].y,
                    paths.locations[b].x,
                    paths.locations[b].y
                )
                edges[path] = [a, b, line]
            }
        }

        this.paths = new PathGraph({ nodes, edges })
    }

    abstract get story(): AdventureStory<this>

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

            this.add.graphics().setDepth(Infinity)
            let lineObjs = []
            for (let pathName in this.paths.edges) {
                let path = this.paths.edges[pathName]
                let a = path.getPointA()
                let b = path.getPointB()
                lineObjs.push(this.add.line(0, 0, a.x, a.y, b.x, b.y).setOrigin(0, 0))
            }

            for (let i = 0; i < lineObjs.length; i++) {
                let pct = lineObjs.length == 1 ? 1.0 : i / (lineObjs.length - 1)
                let grad = Math.floor(255.0 * pct)
                let col = (grad << 16) | (0 << 8) | (grad << 0)
                lineObjs[i].setStrokeStyle(2, col, 1)
                lineObjs[i].setDepth(Infinity)
            }
        }
    }

    private messageTween: Phaser.Tweens.Tween | undefined
    showMessage(message: string, fadeDelay: number = 0, color?: string) {
        if(color) this.messageBox.setColor(color);
        else this.messageBox.setColor('#eea');
        this.messageBox.setText(message);
        this.messageTween?.stop()
        this.messageBox.alpha = 1
        this.messageTween = this.tweens.add({
            targets: this.messageBox,
            alpha: { from: 1, to: 0 },
            easing: 'Quintic.in',
            duration: 4 * this.transitionDuration,
            delay: fadeDelay
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
            let item = new ItemSprite(
                this,
                {
                    itemName: e,
                    x: this.w * 0.75 + 2 * this.s,
                    y: h,
                    textSide: 'inventory'
                }
            )
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

    gotoState(key: string) {
        this.adventureState?.teardown(this)
        if(!this.story.states[key]) alert(`ALERTA! You forgot to define a story state ${key} for scene ${this.scene.key}`)
        this.adventureState = this.story.states[key]
        this.adventureState.setup(this)
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

    pathfind(thing: Phaser.GameObjects.Components.Transform, to: Phaser.Types.Math.Vector2Like, speed: number): Phaser.Tweens.TweenChain | undefined {
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

        let thingPosition = new Phaser.Math.Vector2(
            thing.x,
            thing.y
        )

        let targetEdge = this.paths.minEdgeBy(
            e => closestPoint(this.paths.edges[e], to).distance(to)
        )
        let sourceEdge = this.paths.minEdgeBy(
            e => closestPoint(this.paths.edges[e], thingPosition).distance(thingPosition)
        )

        if (!targetEdge || !sourceEdge) {
            return undefined
        }

        let sourcePoint = closestPoint(this.paths.edges[sourceEdge], thingPosition)
        let targetPoint = closestPoint(this.paths.edges[targetEdge], to)

        let tweenVertices: Phaser.Math.Vector2[]

        if (targetEdge == sourceEdge) {
            tweenVertices = [sourcePoint, targetPoint]
        } else {
            let targetVertices = this.paths.adjacencies[targetEdge]
            let sourceVertices = this.paths.adjacencies[sourceEdge]

            let minimum: { weight: number, vertices: string[] } | undefined

            for (let targetVertex of targetVertices) {
                let targetWeight = this.paths.nodes[targetVertex].distance(to)
                for (let sourceVertex of sourceVertices) {
                    let sourceWeight = this.paths.nodes[sourceVertex].distance(thingPosition)

                    let addedWeight = targetWeight + sourceWeight

                    let vertexPathResult =
                        this.paths.bfs(
                            sourceVertex,
                            targetVertex,
                            e => Phaser.Geom.Line.Length(this.paths.edges[e])
                        )

                    if (vertexPathResult) {
                        vertexPathResult.weight += addedWeight
                        if (minimum == undefined || vertexPathResult.weight < minimum.weight) {
                            minimum = vertexPathResult
                        }
                    }
                }
            }

            if(!minimum) return undefined

            tweenVertices =
                [sourcePoint].concat(minimum.vertices.map(n => this.paths.nodes[n])).concat([targetPoint])
        }

        let backToPath = {
            x: sourcePoint.x,
            y: sourcePoint.y,
            duration: (thingPosition.distance(sourcePoint)) / speed
        }

        let tweens = [backToPath]

        for(let i = 0; i < tweenVertices.length - 1; i++) {
            let here = tweenVertices[i]
            let there = tweenVertices[i + 1]
            tweens.push({
                x: there.x,
                y: there.y,
                duration: (here.distance(there)) / speed
            })
        }

        return this.tweens.chain({
            targets: thing,
            tweens: tweens
        })
    }

    speechTween(duration: number, content: string, color?: string, options?: SpeechTweenOptions): Omit<Phaser.Types.Tweens.TweenBuilderConfig, "targets"> {
        let extras: { [key: string]: any }  = {}
        if(options?.onComplete) {
            extras.onComplete = options.onComplete
        }
        if(options?.delayEnding == undefined || options.delayEnding) {
            extras.completeDelay = duration
        }
        return {
            y: "-=16",
            yoyo: true,
            duration: 50,
            repeat: 6,
            onStart: () => {
                this.showMessage(
                    content,
                    duration - 1000,
                    color
                )
            },
            ...extras
        }
    }
}

type SpeechTweenOptions = {
    delayEnding?: boolean,
    onComplete?: Phaser.Types.Tweens.TweenOnCompleteCallback
}
