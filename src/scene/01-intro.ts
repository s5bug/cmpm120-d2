import 'phaser';

import Progresser from "../progresser.ts";

import FisjEnterprises from '../assets/fisjenterprises.png';
import debugCode from "../debug-code.ts";

import Sparkle from '../assets/sparkle.png';
import CrowEraBackground from '../assets/02-crow-era/background.png';
import CrowEraSun from '../assets/02-crow-era/sun.png';
import CrowEraBackLayer from '../assets/02-crow-era/back-layer.png';
import CrowEraMiddleLayer from '../assets/02-crow-era/middle-layer.png';
import RiverOfTime from '../assets/02-crow-era/river-of-time.png';
import FishgirlImage from '../assets/fishgirl.png';

export default class IntroScene extends Progresser {
    companyLogo!: Phaser.GameObjects.Sprite

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    preload() {
        this.load.image('fisj-enterprises', FisjEnterprises)
    }

    setupNextLoader() {
        this.load.sceneModule('crow-era', () => import('./02-crow-era.ts'))

        this.load.spritesheet('sparkle', Sparkle, { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('fishgirl', FishgirlImage, { frameWidth: 64, frameHeight: 128 })
        this.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.anims.create({
                key: 'sparkle-sparkle',
                frameRate: 3,
                frames: this.anims.generateFrameNumbers('sparkle', { start: 0, end: 1 }),
                repeat: -1
            })
            this.anims.create({
                key: 'fishgirl-left',
                frameRate: 2,
                frames: this.anims.generateFrameNumbers('fishgirl', { start: 4, end: 5 }),
                repeat: -1,
            })
            this.anims.create({
                key: 'fishgirl-idle',
                frameRate: 2,
                frames: this.anims.generateFrameNumbers('fishgirl', { start: 0, end: 1 }),
                repeat: -1
            })
            this.anims.create({
                key: 'fishgirl-right',
                frameRate: 2,
                frames: this.anims.generateFrameNumbers('fishgirl', { start: 2, end: 3 }),
                repeat: -1
            })
        })

        this.load.image('crow-era-background', CrowEraBackground)
        this.load.image('crow-era-sun', CrowEraSun)
        this.load.image('crow-era-back-layer', CrowEraBackLayer)
        this.load.image('crow-era-middle-layer', CrowEraMiddleLayer)
        this.load.image('river-of-time', RiverOfTime)
    }

    create() {
        super.create()

        const w = this.game.config.width as number;
        const h = this.game.config.height as number;

        this.companyLogo = this.add.sprite(w / 2, h / 2, 'fisj-enterprises')
        this.companyLogo.alpha = 0.0

        let fadeLogoIn: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: this.companyLogo,
            alpha: 1.0,
            ease: Phaser.Math.Easing.Expo.In,
            duration: 1500
        }

        fadeLogoIn.completeDelay = 2000
        fadeLogoIn.onComplete = () => this.gotoScene('crow-era')

        this.tweens.add(fadeLogoIn)

        debugCode("x", this, () => this.gotoScene('crow-era', undefined, true))
    }

    beforeSceneSwitch(key: string, fast: boolean): void | Promise<void> {
        key;
        if(fast) {
            return
        } else {
            return new Promise(resolve => {
                let fadeLogoOut: Phaser.Types.Tweens.TweenBuilderConfig = {
                    targets: this.companyLogo,
                    alpha: 0.0,
                    ease: Phaser.Math.Easing.Expo.Out,
                    duration: 1500,
                    onComplete: () => resolve()
                }

                this.tweens.add(fadeLogoOut)
            })
        }
    }
}
