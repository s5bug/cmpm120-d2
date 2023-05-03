import 'phaser';

export default (scene: Phaser.Scene, cb: () => void) => {
    let debugCombo =
        scene.input.keyboard?.createCombo(
            'WHATSLIGMA',
            {}
        )

    scene.input.keyboard?.on('keycombomatch', (kb: Phaser.Input.Keyboard.KeyCombo, _: KeyboardEvent) => {
        if(kb == debugCombo) {
            cb()
        }
    })
}