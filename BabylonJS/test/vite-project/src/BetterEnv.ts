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
  Animation,
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
    console.log('=== _init ===', webGPUSupported)
    // if (webGPUSupported) {
    //   this.engine = new WebGPUEngine(this.renderCanvas)

    //   return
    // }

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
    this._createCar(scene)
    this._createValleyvillage(scene)

    return scene
  }
  _createCar(scene) {
    SceneLoader.ImportMeshAsync('', 'src/assets/meshes/', 'car.glb').then(() => {
      const car = scene.getMeshByName('car')
      car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2)
      car.position.y = 0.16
      car.position.x = -3
      car.position.z = 8

      const animCar = new Animation(
        'carAnimation',
        'position.z',
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
      )

      const carKeys = []

      carKeys.push({
        frame: 0,
        value: 10,
      })

      carKeys.push({
        frame: 200,
        value: -15,
      })

      animCar.setKeys(carKeys)

      car.animations = []
      car.animations.push(animCar)

      scene.beginAnimation(car, 0, 200, true)

      //wheel animation
      const wheelRB = scene.getMeshByName('wheelRB')
      const wheelRF = scene.getMeshByName('wheelRF')
      const wheelLB = scene.getMeshByName('wheelLB')
      const wheelLF = scene.getMeshByName('wheelLF')

      scene.beginAnimation(wheelRB, 0, 30, true)
      scene.beginAnimation(wheelRF, 0, 30, true)
      scene.beginAnimation(wheelLB, 0, 30, true)
      scene.beginAnimation(wheelLF, 0, 30, true)
    })
  }
  _createValleyvillage(scene) {
    SceneLoader.ImportMeshAsync('', 'src/assets/meshes/', 'valleyvillage.glb')
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
