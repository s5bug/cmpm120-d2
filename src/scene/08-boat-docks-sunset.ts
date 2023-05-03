import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class BoatDocksSunset extends AdventureScene {
    loadOutro!: Promise<void>;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    create() {
        super.create();

        if(this.game.scene.getScene('outro')) {
            this.loadOutro = Promise.resolve()
        } else {
            this.loadOutro = import('./09-outro.ts').then(outroModule => {
                this.game.scene.add('outro', outroModule.default)
            })
        }

        debugCode("x", this, () => this.loadOutro.then(() => this.scene.start('outro')))
    }
}
