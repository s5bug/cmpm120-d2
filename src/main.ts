import 'phaser';

import IntroScene from "./scene/01-intro.ts";

// class Demo1 extends AdventureScene {
//     constructor() {
//         super("demo1", "First Room");
//     }
//
//     onEnter() {
//
//         let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => this.showMessage("Metal, bent."))
//             .on('pointerdown', () => {
//                 this.showMessage("No touching!");
//                 this.tweens.add({
//                     targets: clip,
//                     x: '+=' + this.s,
//                     repeat: 2,
//                     yoyo: true,
//                     ease: 'Sine.inOut',
//                     duration: 100
//                 });
//             });
//
//         let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => {
//                 this.showMessage("It's a nice key.")
//             })
//             .on('pointerdown', () => {
//                 this.showMessage("You pick up the key.");
//                 this.gainItem('key');
//                 this.tweens.add({
//                     targets: key,
//                     y: `-=${2 * this.s}`,
//                     alpha: { from: 1, to: 0 },
//                     duration: 500,
//                     onComplete: () => key.destroy()
//                 });
//             })
//
//         let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => {
//                 if (this.hasItem("key")) {
//                     this.showMessage("You've got the key for this door.");
//                 } else {
//                     this.showMessage("It's locked. Can you find a key?");
//                 }
//             })
//             .on('pointerdown', () => {
//                 if (this.hasItem("key")) {
//                     this.loseItem("key");
//                     this.showMessage("*squeak*");
//                     door.setText("🚪 unlocked door");
//                     this.gotoScene('demo2');
//                 }
//             })
//
//     }
// }
//
// class Demo2 extends AdventureScene {
//     constructor() {
//         super("demo2", "The second room has a long name (it truly does).");
//     }
//     onEnter() {
//         this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
//             .setFontSize(this.s * 2)
//             .setInteractive()
//             .on('pointerover', () => {
//                 this.showMessage("You've got no other choice, really.");
//             })
//             .on('pointerdown', () => {
//                 this.gotoScene('demo1');
//             });
//
//         let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
//             .setInteractive()
//             .on('pointerover', () => {
//                 this.showMessage('*giggles*');
//                 this.tweens.add({
//                     targets: finish,
//                     x: this.s + (this.h - 2 * this.s) * Math.random(),
//                     y: this.s + (this.h - 2 * this.s) * Math.random(),
//                     ease: 'Sine.inOut',
//                     duration: 500
//                 });
//             })
//             .on('pointerdown', () => this.gotoScene('outro'));
//     }
// }
//
// class Intro extends Phaser.Scene {
//     constructor() {
//         super('intro')
//     }
//     create() {
//         this.add.text(50,50, "Adventure awaits!").setFontSize(50);
//         this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
//         this.input.on('pointerdown', () => {
//             this.cameras.main.fade(1000, 0,0,0);
//             this.time.delayedCall(1000, () => this.scene.start('demo1'));
//         });
//     }
// }
//
// class Outro extends Phaser.Scene {
//     constructor() {
//         super('outro');
//     }
//     create() {
//         this.add.text(50, 50, "That's all!").setFontSize(50);
//         this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
//         this.input.on('pointerdown', () => this.scene.start('intro'));
//     }
// }

class SceneModuleFile extends Phaser.Loader.File {
    makeImport: () => Promise<{ default: typeof Phaser.Scene }>

    constructor(loader: Phaser.Loader.LoaderPlugin, key: string, makeImport: () => Promise<{ default: typeof Phaser.Scene }>) {
        super(loader, { type: 'sceneModule', key: key, url: '' });

        this.makeImport = makeImport;
    }

    load() {
        if(this.state == Phaser.Loader.FILE_POPULATED) {
            // @ts-ignore
            this.loader.nextFile(this, true)
        } else {
            let importScript: Promise<{ default: typeof Phaser.Scene }> =
                this.makeImport()

            importScript.then(module => {
                this.loader.scene.scene.add(this.key, module.default)
                this.loader.nextFile(this, true)
            }).catch(() => this.loader.nextFile(this, false))
        }
    }
}

class SceneModulePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        pluginManager.registerFileType('sceneModule', this.sceneModuleCallback)
    }

    sceneModuleCallback(key: string, makeImport: () => Promise<{ default: typeof Phaser.Scene }>) {
        // @ts-ignore
        this.addFile(new SceneModuleFile(this, key, makeImport))
        return this
    }
}

class TtfFile extends Phaser.Loader.File {
    fontFamily: string
    ttfUrl: string
    fontObject: FontFace | undefined

    constructor(loader: Phaser.Loader.LoaderPlugin, family: string, url: string) {
        super(loader, { type: 'ttf', key: family, url: '' });
        this.fontFamily = family;
        this.ttfUrl = url;
    }

    load() {
        if (this.state === Phaser.Loader.FILE_POPULATED) {
            // @ts-ignore
            this.loader.nextFile(this, true)
        } else {
            this.fontObject = new FontFace(
                this.fontFamily,
                `url("${this.ttfUrl}")`
            )
            this.fontObject.load()
                .then(this.onLoad)
                // @ts-ignore
                .catch(() => this.loader.nextFile(this, false))
        }
    }

    // @ts-ignore
    onLoad(ff: FontFace) {
        document.fonts.add(ff)
        // @ts-ignore
        this.loader.nextFile(this, true);
    }
}

class TtfFilePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        pluginManager.registerFileType('ttf', this.ttfFileCallback)
    }

    ttfFileCallback(family: string, url: string) {
        // @ts-ignore
        this.addFile(new TtfFile(this, family, url))
        return this
    }
}

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    plugins: {
        global: [
            { key: 'SceneModulePlugin', plugin: SceneModulePlugin, start: true },
            { key: 'TtfFilePlugin', plugin: TtfFilePlugin, start: true },
        ]
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    title: "CMPM D2",
    input: {
        keyboard: true,
    },
});

game.scene.add('intro', IntroScene, true)

declare global {
    interface Window { game: Phaser.Game }
}

window.game = game;
