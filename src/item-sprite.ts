import 'phaser';

import items from "./items-list.ts";

export default class ItemSprite extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, itemName: string, x?: number, y?: number) {
        let itemImg = new Phaser.GameObjects.Sprite(
            scene,
            0,
            0,
            items[itemName].sprite
        )
        let itemTxt = new Phaser.GameObjects.Text(
            scene,
            0,
            0,
            items[itemName].name,
            {}
        )
        super(scene, x, y, [itemImg, itemTxt]);
    }
}
