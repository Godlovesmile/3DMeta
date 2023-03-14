import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
  WebGPUEngine,
} from 'babylonjs'

export default class BasicScene {
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
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 4, 6, new Vector3(0, 0, 0))

    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    MeshBuilder.CreateBox('box', {})

    this.importMesh()

    return scene
  }

  async importMesh() {
    // SceneLoader.ImportMeshAsync('semi_house', 'https://assets.babylonjs.com/meshes/', 'both_houses_scene.babylon')
    // ['ground', 'semi_house']
    const result = await SceneLoader.ImportMeshAsync(
      '',
      'https://assets.babylonjs.com/meshes/',
      'both_houses_scene.babylon'
    )
    const house1 = this.scene.getMeshByName('detached_house')

    house1.position.y = 2

    console.log('=== result ===', result)
  }
}
