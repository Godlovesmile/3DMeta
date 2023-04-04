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
  Texture,
  Vector4,
  Animation,
} from 'babylonjs'
// import * as earcut from 'earcut'
// ;(window as any).earcut = earcut

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
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 5, new Vector3(0, 0, 0))

    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(1, 1, 0), scene)

    this.scene = scene
    this.buildCar()

    return scene
  }
  buildCar() {
    const carbody = this.buildCarBody()
    const wheelRB = this.buildCarWheel(carbody)
    // const car = Mesh.MergeMeshes([carbody, wheelRB], true, false, undefined, false, true)
  }
  buildCarBody() {
    // base
    const outline = [new Vector3(-0.3, 0, -0.1), new Vector3(0.2, 0, -0.1)]

    // curved front
    for (let i = 0; i < 20; i++) {
      outline.push(new Vector3(0.2 * Math.cos((i * Math.PI) / 40), 0, 0.2 * Math.sin((i * Math.PI) / 40) - 0.1))
    }

    // top
    outline.push(new Vector3(0, 0, 0.1))
    outline.push(new Vector3(-0.3, 0, 0.1))

    // car face UVS
    const faceUV = [new Vector4(0, 0.5, 0.38, 1), new Vector4(0, 0, 1, 0.5), new Vector4(0.38, 1, 0, 0.5)]

    // car material
    const carBodyMat = new StandardMaterial('carBodyMat', this.scene)
    carBodyMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/car.png')

    const carbody = MeshBuilder.ExtrudePolygon(
      'carbody',
      { shape: outline, depth: 0.2, faceUV, wrap: true },
      this.scene
    )
    carbody.rotation.x = -Math.PI / 2
    carbody.material = carBodyMat

    // car 动画
    const animCar = new Animation(
      'carAnimation',
      'position.x',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    const carKeys = []

    carKeys.push({ frame: 0, value: -4 })
    carKeys.push({ frame: 150, value: 4 })
    carKeys.push({ frame: 210, value: 4 })
    animCar.setKeys(carKeys)

    carbody.animations = [animCar]

    this.scene.beginAnimation(carbody, 0, 210, true)

    return carbody
  }
  buildCarWheel(carbody) {
    // wheel face UVS
    const wheelUV = [new Vector4(0, 0, 1, 1), new Vector4(0, 0.5, 0, 0.5), new Vector4(0, 0, 1, 1)]

    // wheel material
    const wheelMat = new StandardMaterial('wheelMat', this.scene)
    wheelMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/wheel.png')

    const wheelRB = MeshBuilder.CreateCylinder('wheelRB', {
      diameter: 0.125,
      height: 0.05,
      faceUV: wheelUV,
    })
    wheelRB.parent = carbody
    wheelRB.material = wheelMat
    wheelRB.position.x = -0.2
    wheelRB.position.y = 0.035
    wheelRB.position.z = -0.1

    const wheelRF = wheelRB.clone('wheelRF')
    wheelRF.position.x = 0.05

    const wheelLB = wheelRB.clone('wheelLB')
    wheelLB.position.y = -0.2 - 0.035

    const wheelLF = wheelLB.clone('wheelLF')
    wheelLF.position.x = 0.05

    const animWheel = new Animation(
      'wheelAnimation',
      'rotation.y',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    const wheelKeys = []

    wheelKeys.push({ frame: 0, value: 0 })
    wheelKeys.push({ frame: 30, value: 2 * Math.PI })
    animWheel.setKeys(wheelKeys)

    wheelRB.animations = [animWheel]
    wheelRF.animations = [animWheel]
    wheelLB.animations = [animWheel]
    wheelLF.animations = [animWheel]

    this.scene.beginAnimation(wheelRB, 0, 30, true)
    this.scene.beginAnimation(wheelRF, 0, 30, true)
    this.scene.beginAnimation(wheelLB, 0, 30, true)
    this.scene.beginAnimation(wheelLF, 0, 30, true)

    return wheelRB
  }
}
