import 'phaser';

import items from "./items-list.ts";

export default class ItemSprite extends Phaser.GameObjects.Container {
    itemName: string
    textSide: 'right' | 'left' | 'inventory'
    itemImg: Phaser.GameObjects.Sprite
    itemTxt: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, itemName: string, x?: number, y?: number, textSide?: 'right' | 'left' | 'inventory') {
        if(!items[itemName]) alert(`Alerta! You have not defined the item ${itemName}!`)

        let itemImg = new Phaser.GameObjects.Sprite(
            scene,
            0,
            0,
            items[itemName].sprite
        )
        itemImg.setOrigin(0.5, 0.5)
        let itemTxt = new Phaser.GameObjects.Text(
            scene,
            0,
            0,
            items[itemName].name,
            {}
        )
        itemTxt.setOrigin(0, 0.5)
        super(scene, x, y, [itemImg, itemTxt])
        this.itemName = itemName
        this.textSide = textSide || 'right'
        this.itemImg = itemImg
        this.itemTxt = itemTxt
    }

    addedToScene() {
        super.addedToScene();

        if(this.textSide == 'inventory') {
            this.itemImg.setScale(2 * (this.itemTxt.height / this.itemImg.height))
        }

        if(this.textSide == 'left') {
            this.itemTxt.x = (-(this.itemImg.width / 2) * this.itemImg.scale) + (this.itemTxt.height / 2) - (this.itemTxt.width)
        } else {
            this.itemTxt.x = ((this.itemImg.width / 2) * this.itemImg.scale) + (this.itemTxt.height / 2)
        }
        this.itemTxt.y = 0

        if(this.textSide != 'inventory') {
            this.itemTxt.alpha = 0.0
            this.itemTxt.scale = 0.0

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
}
