import { BoxGeometry, Mesh, MeshBasicMaterial, SphereGeometry, MeshStandardMaterial } from '../../../../../node_modules/three/build/three.module.js'

function createCube() {
    // 立方体
    const geometry = new BoxGeometry(1, 1, 1)
    // 球体
    // const geometry = new SphereGeometry(1, 30, 30)

    // 备注: MeshBasicMaterial 这种材质会忽略场景中的任何灯光
    // const material = new MeshBasicMaterial({ color: 'seagreen' })

    const material = new MeshStandardMaterial({ color: 'purple' })
    const cube = new Mesh(geometry, material)

    cube.rotation.set(-0.5, -0.1, 0.8)

    return cube
}

export { createCube }