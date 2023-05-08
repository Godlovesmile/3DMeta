import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
  WebGPUEngine,
  StandardMaterial,
  Texture,
} from 'babylonjs'
import 'babylonjs-loaders'

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

    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0))
    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(1, 1, 0), scene)

    // this._createVillageheightmap()
    this._createValleyvillage()

    return scene
  }
  _createValleyvillage() {
    SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'valleyvillage.glb')
  }
  _createVillageheightmap() {
    // === ground ===
    const groundMat = new StandardMaterial('groundMat')
    groundMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/villagegreen.png')
    groundMat.diffuseTexture.hasAlpha = true

    const ground = MeshBuilder.CreateGround('ground', { width: 24, height: 24 })
    ground.material = groundMat

    // === large ground ===
    // material
    const largeGroundMat = new StandardMaterial('largeGroundMat')
    largeGroundMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/valleygrass.png')

    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
      'largeGround',
      'https://assets.babylonjs.com/environments/villageheightmap.png',
      { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 },
      this.scene
    )
    largeGround.material = largeGroundMat
    largeGround.position.y = -0.01

    return largeGround
  }
}
