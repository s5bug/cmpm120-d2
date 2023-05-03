import 'phaser';

import FisjEnterprises from '../assets/fisjenterprises.png';
import debugCode from "../debug-code.ts";

import FishgirlImage from '../assets/fishgirl.png';

export default class IntroScene extends Phaser.Scene {
    loadCrow!: Promise<void>

    companyLogo!: Phaser.GameObjects.Sprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    preload() {
        this.load.image('fisj-enterprises', FisjEnterprises)
    }

    create() {
        const w = this.game.config.width as number;
        const h = this.game.config.height as number;

        if(this.game.scene.getScene('crow-era')) {
            this.loadCrow = Promise.resolve()
        } else {
            this.load.image('fishgirl', FishgirlImage)

            let loadAssetsComplete: Promise<void> = new Promise<void>(resolve => {
                this.load.start()
                this.load.on(Phaser.Loader.Events.COMPLETE, () => resolve())
            })

            let loadModuleComplete = import('./02-crow-era.ts')

            this.loadCrow = loadAssetsComplete.then(() => loadModuleComplete).then(crowModule => {
                this.game.scene.add('crow-era', crowModule.default)
            })
        }

        this.companyLogo = this.add.sprite(w / 2, h / 2, 'fisj-enterprises')
        this.companyLogo.alpha = 0.0

        let fadeLogoIn: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: this.companyLogo,
            alpha: 1.0,
            ease: Phaser.Math.Easing.Expo.In,
            duration: 1500
        }

        let fadeLogoOut: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: this.companyLogo,
            alpha: 0.0,
            ease: Phaser.Math.Easing.Expo.Out,
            duration: 1500,
            onComplete: () => this.scene.start('crow-era')
        }

        fadeLogoIn.completeDelay = 2000
        fadeLogoIn.onComplete =
            () => this.loadCrow.then(() => this.tweens.add(fadeLogoOut))

        this.tweens.add(fadeLogoIn)

        debugCode("x", this, () => this.loadCrow.then(() => this.scene.start('crow-era')))
    }
}
