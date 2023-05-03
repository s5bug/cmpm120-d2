import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class LectureHall extends AdventureScene {
    loadBoatDocksSunset!: Promise<void>;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Lecture Hall", "Va'weál\nDartfrog 5762");
    }

    create() {
        super.create();

        if(this.game.scene.getScene('boat-docks-sunset')) {
            this.loadBoatDocksSunset = Promise.resolve()
        } else {
            this.loadBoatDocksSunset = import('./08-boat-docks-sunset.ts').then(boatDocksSunsetModule => {
                this.game.scene.add('boat-docks-sunset', boatDocksSunsetModule.default)
            })
        }

        debugCode("x", this, () => this.loadBoatDocksSunset.then(() => this.scene.start('boat-docks-sunset')))
    }
}
