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
  Axis,
  Tools,
  Space,
} from 'babylonjs'
import 'babylonjs-loaders'

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
    const camera = new ArcRotateCamera('camera', -Math.PI / 1.5, Math.PI / 2.2, 15, new Vector3(0, 0, 0))

    camera.attachControl(this.renderCanvas, true)

    new HemisphericLight('light', new Vector3(1, 1, 0), scene)

    this.scene = scene

    // 创建汽车通过纹理来渲染
    // this.buildCar()

    // 创建汽车通过模型来渲染
    // SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'car.glb').then(() => {
    //   const car = scene.getMeshByName('car')

    //   car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2)
    //   car.position.y = 0.16
    //   car.position.x = -3
    //   car.position.z = 8

    //   const animCar = new BABYLON.Animation(
    //     'carAnimation',
    //     'position.z',
    //     30,
    //     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    //     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    //   )

    //   const carKeys = []

    //   carKeys.push({
    //     frame: 0,
    //     value: 8,
    //   })

    //   carKeys.push({
    //     frame: 150,
    //     value: -7,
    //   })

    //   carKeys.push({
    //     frame: 200,
    //     value: -7,
    //   })

    //   animCar.setKeys(carKeys)

    //   car.animations = []
    //   car.animations.push(animCar)

    //   scene.beginAnimation(car, 0, 200, true)

    //   //wheel animation
    //   const wheelRB = scene.getMeshByName('wheelRB')
    //   const wheelRF = scene.getMeshByName('wheelRF')
    //   const wheelLB = scene.getMeshByName('wheelLB')
    //   const wheelLF = scene.getMeshByName('wheelLF')

    //   scene.beginAnimation(wheelRB, 0, 30, true)
    //   scene.beginAnimation(wheelRF, 0, 30, true)
    //   scene.beginAnimation(wheelLB, 0, 30, true)
    //   scene.beginAnimation(wheelLF, 0, 30, true)
    // })

    // SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'village.glb', scene)

    // 渲染人物模型
    // SceneLoader.ImportMeshAsync('', 'https://playground.babylonjs.com/scenes/Dude/', 'Dude.babylon', scene).then((result) => {
    //   const dude = result.meshes[0]
    //   dude.scaling = new Vector3(0.25, 0.25, 0.25)

    //   scene.beginAnimation(result.skeletons[0], 0, 30, true, 1.0)
    // })

    // 渲染任务在村庄中走动
    const track = []
    const walk = function(turn, dist) {
      this.turn = turn
      this.dist = dist
    }

    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))

    SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'village.glb', scene)
    SceneLoader.ImportMeshAsync('him', 'https://playground.babylonjs.com/scenes/Dude/', 'Dude.babylon', scene).then(
      (result) => {
        const dude = result.meshes[0]

        dude.scaling = new Vector3(0.008, 0.008, 0.008)
        dude.position = new Vector3(-6, 0, 0.5)
        dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL)

        const startRotation = dude.rotationQuaternion.clone()

        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0)

        let step = 0.015
        let distance = 0
        let p = 0
        scene.onBeforeRenderObservable.add(() => {
          dude.movePOV(0, 0, step)
          distance += step

          if (distance > track[p].dist) {
            dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL)
            p += 1
            p %= track.length

            if (p === 0) {
              distance = 0
              dude.position = new Vector3(-6, 0, 0)
              dude.rotationQuaternion = startRotation.clone()
            }
          }
        })
      }
    )

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
