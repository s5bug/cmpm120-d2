import 'phaser';

import items from "./items-list.ts";

export default class ItemSprite extends Phaser.GameObjects.Container {
    itemImg: Phaser.GameObjects.Sprite;
    itemTxt: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, itemName: string, x?: number, y?: number) {
        if(!items[itemName]) alert(`Alerta! You have not defined the item ${itemName}!`)

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
        this.itemImg = itemImg;
        this.itemTxt = itemTxt;

        this.itemTxt.alpha = 0.0;
        this.itemTxt.scale = 0.0;

        this.itemImg.setInteractive()
        this.itemImg.on('pointerover', () => {
            this.itemTxt.scale = 1.0
            this.itemTxt.alpha = 1.0
        })
        this.itemImg.on('pointerout', () => {
            this.itemTxt.alpha = 0.0
            this.itemTxt.scale = 0.0
        })
    }
}
