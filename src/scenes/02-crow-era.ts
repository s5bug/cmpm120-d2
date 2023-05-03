import 'phaser';

import AdventureScene from "../adventure.ts";

export default class CrowEra extends AdventureScene {
    loadDartfrog!: Promise<void>

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál");
    }

    create() {
        this.loadDartfrog = import('./03-dartfrog-era.ts').then(dartfrogModule => {
            this.game.scene.add('dartfrog-era', dartfrogModule.default)
        })
    }
}
