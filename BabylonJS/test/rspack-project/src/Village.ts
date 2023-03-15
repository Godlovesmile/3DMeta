import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Sound,
  StandardMaterial,
  Texture,
  Tools,
  Vector3,
  WebGPUEngine,
} from 'babylonjs'

export default class Village {
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
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0))

    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(1, 1, 0), scene)

    // const music = new Sound('cello', 'https://playground.babylonjs.com/sounds/cellolong.wav', scene, null, { loop: true, autoplay: true })

    const roof = MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 })
    roof.scaling.x = 0.75
    roof.rotation.z = Math.PI / 2
    roof.position.y = 1.22

    const roofMat = new StandardMaterial('roofMat')
    roofMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/roof.jpg', scene)

    roof.material = roofMat

    // width: 1, height: 1, depth: 1
    const box = MeshBuilder.CreateBox('box', {})
    box.position.y = 0.5
    // box.position.y = Tools.ToRadians(45)
    // box.scaling.x = 2
    // box.scaling.y = 1.5
    // box.scaling.z = 3
    // box.scaling = new Vector3(2, 1.5, 3)

    const boxMat = new StandardMaterial('boxMat')
    boxMat.diffuseTexture = new Texture('https://www.babylonjs-playground.com/textures/floor.png', scene)

    box.material = boxMat

    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 })
    const groundMat = new StandardMaterial('groundMat')
    groundMat.diffuseColor = new Color3(0, 1, 0)
    ground.material = groundMat

    return scene
  }
}
