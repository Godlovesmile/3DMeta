import { BoxGeometry, Mesh, MeshBasicMaterial, SphereGeometry } from '../../../../../node_modules/three/build/three.module.js'

function createCube() {
    // 立方体
    // const geometry = new BoxGeometry(1, 1, 1)
    // 球体
    const geometry = new SphereGeometry(1, 30, 30)
    const material = new MeshBasicMaterial({ color: 'seagreen' })
    const cube = new Mesh(geometry, material)

    return cube
}

export { createCube }