import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class Restaurant extends AdventureScene {
    loadTunnel!: Promise<void>;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Co'n Co'yoli's", "Authentic Acuerlan cuisine\n\nVa'weál\nDartfrog 5762");
    }

    create() {
        super.create();

        if(this.game.scene.getScene('tunnel')) {
            this.loadTunnel = Promise.resolve()
        } else {
            this.loadTunnel = import('./06-tunnel.ts').then(tunnelModule => {
                this.game.scene.add('tunnel', tunnelModule.default)
            })
        }

        debugCode("x", this, () => this.loadTunnel.then(() => this.scene.start('tunnel')))
        debugCode("c", this, () => this.scene.start('boat-docks'))
    }
}
