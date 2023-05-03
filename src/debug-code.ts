import 'phaser';

export default (scene: Phaser.Scene, cb: () => void) => {
    scene.input.keyboard?.on('keydown', (ev: KeyboardEvent) => {
        if(new URL(window.location.href).searchParams.get("debug") == "true" && ev.key == "x") {
            cb()
        }
    })
}