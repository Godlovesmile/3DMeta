import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
  WebGPUEngine,
  Mesh,
  Color3,
  DynamicTexture,
  StandardMaterial,
  Color4,
  TransformNode,
} from 'babylonjs'
import * as earcut from 'earcut'

;(window as any).earcut = earcut

export default class VillageAnimation {
  engine: Engine
  scene: Scene

  constructor(private renderCanvas: HTMLCanvasElement) {
    this._init()
  }

  async _init() {
    const webGPUSupported = await (WebGPUEngine as any).IsSupportedAsync

    if (webGPUSupported) {
      this.engine = new WebGPUEngine(this.renderCanvas)

      return
    }

    this.engine = new Engine(this.renderCanvas)
    this.scene = this.createScene()

    // register a render loop to repeatedly render the scene
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })

    // watch fro browser/canvas resize events
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }

  createScene() {
    const scene = new Scene(this.engine)
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0))

    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    this.buildCar()

    return scene
  }
  buildCar() {
    this.buildCarBody()
  }
  buildCarBody() {
    // base
    const outline = [new Vector3(-0.3, 0, -0.1), new Vector3(0.2, 0, -0.1)]
    const carbody = MeshBuilder.ExtrudePolygon('carbody', { shape: outline, depth: 0.2 })

    // curved front
    for (let i = 0; i < 20; i++) {
      outline.push(new Vector3(0.2 * Math.cos((i * Math.PI) / 40), 0, 0.2 * Math.sin((i * Math.PI) / 40) - 0.1))
    }

    // top
    outline.push(new Vector3(0, 0, 0.1))
    outline.push(new Vector3(-0.3, 0, 0.1))

    return carbody
  }
  buildCarWheel() {}
}