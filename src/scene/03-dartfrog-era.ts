import 'phaser';

import AdventureScene from "../adventure.ts";

export default class DartfrogEra extends AdventureScene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Va\'weál", "Era of The Dartfrog\nYear 5762");
    }
}
