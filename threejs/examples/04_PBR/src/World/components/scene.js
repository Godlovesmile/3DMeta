import { Scene, Color } from '../../../../../node_modules/three/build/three.module.js'

function createScene() {
    const scene = new Scene()

    scene.background = new Color()

    return scene
}

export { createScene }