import 'phaser';

export default abstract class Progresser extends Phaser.Scene {
    abstract setupNextLoader(): void;

    create() {
        this.setupNextLoader()
        this.load.start()
    }

    beforeSceneSwitch(key: string, fast: boolean): void | Promise<void> { key; fast; }

    gotoScene(key: string, data?: object | undefined, fast?: boolean) {
        if(this.load.state == Phaser.Loader.LOADER_COMPLETE) {
            let beforeSwitchNormalized = Promise.resolve(this.beforeSceneSwitch(key, fast || false))
            beforeSwitchNormalized.then(() => {
                this.scene.start(key, data)
            })
        } else {
            // TODO: draw progress bar

            this.load.on(Phaser.Loader.Events.COMPLETE, () => this.gotoScene(key, data))
        }
    }
}
