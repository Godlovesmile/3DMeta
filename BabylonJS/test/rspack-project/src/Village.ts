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
import 'babylonjs-loaders'

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

    // 建房子, 通过局部模式进行创建, roof + house + ground
    // this.buildDwellings()

    // 建房子, 通过整体模型进行创建
    SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'village.glb', scene)

    return scene
  }
  buildDwellings() {
    this.buildGround()

    const detached_house = this.buildHouse(1)!
    detached_house.rotation.y = -Math.PI / 16
    detached_house.position.x = -6.8
    detached_house.position.z = 2.5

    const semi_house = this.buildHouse(2)!
    semi_house.rotation.y = -Math.PI / 16
    semi_house.position.x = -4.5
    semi_house.position.z = 3

    const places = [] //each entry is an array [house type, rotation, x, z]
    places.push([1, -Math.PI / 16, -6.8, 2.5])
    places.push([2, -Math.PI / 16, -4.5, 3])
    places.push([2, -Math.PI / 16, -1.5, 4])
    places.push([2, -Math.PI / 3, 1.5, 6])
    places.push([2, (15 * Math.PI) / 16, -6.4, -1.5])
    places.push([1, (15 * Math.PI) / 16, -4.1, -1])
    places.push([2, (15 * Math.PI) / 16, -2.1, -0.5])
    places.push([1, (5 * Math.PI) / 4, 0, -1])
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3])
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5])
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7])
    places.push([2, Math.PI / 1.9, 4.75, -1])
    places.push([1, Math.PI / 1.95, 4.5, -3])
    places.push([2, Math.PI / 1.9, 4.75, -5])
    places.push([1, Math.PI / 1.9, 4.75, -7])
    places.push([2, -Math.PI / 3, 5.25, 2])
    places.push([1, -Math.PI / 3, 6, 4])

    // Create instances from the first two that were built
    const houses = []
    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1) {
        houses[i] = detached_house.createInstance('house' + i)
      } else {
        houses[i] = semi_house.createInstance('house' + i)
      }
      houses[i].rotation.y = places[i][1]
      houses[i].position.x = places[i][2]
      houses[i].position.z = places[i][3]
    }
  }
  buildRoof(width) {
    const roof = MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 })
    roof.scaling.x = 0.75
    roof.scaling.y = width
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
      faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0) //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0) //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0) //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0) //left side
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
    const roof = this.buildRoof(width)
    const box = this.buildBox(width)
    // 合并整体, 方便后续拿到整个 house 对象进行处理
    const house = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)

    return house
  }
  buildGround() {
    const ground = MeshBuilder.CreateGround('ground', { width: 15, height: 16 })
    const groundMat = new StandardMaterial('groundMat')

    groundMat.diffuseColor = new Color3(0, 1, 0)
    ground.material = groundMat

    return ground
  }
}
