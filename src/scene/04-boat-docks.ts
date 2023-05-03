import 'phaser';

import AdventureScene from "../adventure.ts";
import debugCode from "../debug-code.ts";

export default class BoatDocks extends AdventureScene {
    loadRestaurant!: Promise<void>;
    loadLectureHall!: Promise<void>;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config, "Boat Docks", "Va'weál\nDartfrog 5762");
    }

    create() {
        super.create();

        if(this.game.scene.getScene('restaurant')) {
            this.loadRestaurant = Promise.resolve()
        } else {
            this.loadRestaurant = import('./05-restaurant.ts').then(restaurantModule => {
                this.game.scene.add('restaurant', restaurantModule.default)
            })
        }

        if(this.game.scene.getScene('lecture-hall')) {
            this.loadLectureHall = Promise.resolve()
        } else {
            this.loadLectureHall = import('./07-lecture-hall.ts').then(lectureHallModule => {
                this.game.scene.add('lecture-hall', lectureHallModule.default)
            })
        }

        debugCode("x", this, () => this.loadRestaurant.then(() => this.scene.start('restaurant')))
        debugCode("c", this, () => this.loadLectureHall.then(() => this.scene.start('lecture-hall')))
    }
}
