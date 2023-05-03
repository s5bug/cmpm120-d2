import 'phaser';

export default class IntroScene extends Phaser.Scene {
    loadCrow!: Promise<void>

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    preload() {

    }

    create() {
        this.loadCrow = import('./02-crow-era.ts').then(crowModule => {
            this.game.scene.add('crow-era', crowModule.default)
        })
    }
}
