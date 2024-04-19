import { Scene, Color } from '../../../../../node_modules/three/build/three.module.js'

function createScene() {
    const scene = new Scene()

    scene.background = new Color('red')

    return scene
}

export { createScene }