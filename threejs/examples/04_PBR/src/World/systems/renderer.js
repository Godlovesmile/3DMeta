import { WebGLRenderer } from '../../../../../node_modules/three/build/three.module.js'

function createRenderer() {
    const renderer = new WebGLRenderer()

    // 开启物理上的正确照明
    renderer.physicallyCorrectLights = true

    return renderer
}

export { createRenderer }