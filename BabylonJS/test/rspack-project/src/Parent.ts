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
    // 设置三个方向 x, y, z 文本
    const makeTextPlan = (text, color, size) => {
      const dynamicTexture = new DynamicTexture('dynamicTexture', 50, scene, true)
      dynamicTexture.hasAlpha = true
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)

      const material = new StandardMaterial('TextPlaneMaterial', scene)
      material.backFaceCulling = false
      material.specularColor = new Color3(0, 0, 0)
      material.diffuseTexture = dynamicTexture

      const plane = MeshBuilder.CreatePlane('TextPlane', { size }, scene)
      plane.material = material

      return plane
    }

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
    const xChar = makeTextPlan('X', 'red', size / 10)
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0)

    const axisY = MeshBuilder.CreateLines('axisY', {
      points: [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
    })
    axisY.color = new Color3(0, 1, 0)
    const yChar = makeTextPlan('Y', 'green', size / 10)
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size)

    const axisZ = MeshBuilder.CreateLines('axisZ', {
      points: [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
    })
    axisZ.color = new Color3(0, 0, 1)
    const zChar = makeTextPlan('Z', 'blue', size / 10)
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size)
  }
}
