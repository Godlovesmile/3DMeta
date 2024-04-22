import { createScene } from './components/scene.js'
import { createCamera } from './components/camera.js'
import { createCube } from './components/cube.js'
import { Resizer } from './systems/Resizer.js'
import { createRenderer } from './systems/renderer.js'
import { createLights } from './components/lights.js'

let scene
let camera
let renderer
let cube


class World {
    // 1. create an instance of the world app
    constructor(container) {
        const light = createLights()

        scene = createScene()
        camera = createCamera()
        renderer = createRenderer()
        cube = createCube()

        container.append(renderer.domElement)
        scene.add(cube, light)

        const resizer = new Resizer(container, camera, renderer)
    }

    // 2. render the scene
    render() {
        renderer.render(scene, camera)
    }
}

export { World }