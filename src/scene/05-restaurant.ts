import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

import TunnelScene from "./06-tunnel.ts?url";

export default class Restaurant extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Co'n Co'yoli's", "Authentic Acuerlan cuisine\n\nVa'weál\nDartfrog 5762");
    }

    setupNextLoader() {
        // @ts-ignore
        this.load.sceneModule('tunnel', TunnelScene)
    }

    create() {
        super.create();

        debugCode("x", this, () => this.gotoScene('tunnel', undefined, true))
        debugCode("c", this, () => this.gotoScene('lecture-hall', undefined, true))
    }
}
