import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  Sound,
  StandardMaterial,
  Texture,
  Tools,
  Vector3,
  Vector4,
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

    this.buildHouse(2)
    this.buildGround()

    return scene
  }
  buildRoof() {
    const roof = MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 })
    roof.scaling.x = 0.75
    roof.rotation.z = Math.PI / 2
    roof.position.y = 1.22

    const roofMat = new StandardMaterial('roofMat')
    roofMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/roof.jpg', this.scene)

    roof.material = roofMat

    return roof
  }
  buildBox(width) {
    const boxMat = new StandardMaterial('boxMat')
    boxMat.diffuseTexture = new Texture(
      `https://assets.babylonjs.com/environments/${width == 2 ? 'semihouse' : 'cubehouse'}.png`,
      this.scene
    )

    // 墙体贴图 (左下角位置, 右上角位置)
    const faceUV = []

    if (width == 2) {
      faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0) //rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0) //front face
      faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0) //right side
      faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0) //left side
    } else {
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0) //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0) //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0) //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0) //left side
    }

    // width: 1, height: 1, depth: 1
    const box = MeshBuilder.CreateBox('box', { width, faceUV, wrap: true })
    box.position.y = 0.5
    // box.position.y = Tools.ToRadians(45)
    // box.scaling.x = 2
    // box.scaling.y = 1.5
    // box.scaling.z = 3
    // box.scaling = new Vector3(2, 1.5, 3)

    box.material = boxMat

    return box
  }
  buildHouse(width) {
    const roof = this.buildRoof()
    const box = this.buildBox(width)
    // 合并整体, 方便后续拿到整个 house 对象进行处理
    const house = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)

    return house
  }
  buildGround() {
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 })
    const groundMat = new StandardMaterial('groundMat')

    groundMat.diffuseColor = new Color3(0, 1, 0)
    ground.material = groundMat

    return ground
  }
}
