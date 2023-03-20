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
} from 'babylonjs'

export default class Parent {
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
    const camera = new ArcRotateCamera('camera', -Math.PI / 2.2, Math.PI / 2.5, 15, new Vector3(0, 0, 0))

    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    this.showAxis(6, scene)
    return scene
  }

  // === create and draw axes ===
  showAxis(size, scene) {
    const axisX = MeshBuilder.CreateLines('axisX', {
      points: [
        Vector3.Zero(),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, -0.05 * size, 0),
      ],
    })

    axisX.color = new Color3(1, 0, 0)
  }
}
