import { DirectionalLight } from '../../../../../node_modules/three/build/three.module.js'

function createLights() {
  // create a directional light
  const light = new DirectionalLight('red', 8)

  // 定位灯光
  light.position.set(10, 10, 10)

  return light
}

export { createLights }