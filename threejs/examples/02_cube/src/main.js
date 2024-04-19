import { Scene, Color, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, WebGLRenderer } from '../../../node_modules/three/build/three.module.js'

const container = document.querySelector('#scene-container')

// create a scene
const scene = new Scene()

// set the background color
scene.background = new Color('skyblue')

// create a camera
/*
    fov 视野: 相机的视野有多宽, 以度为单位
    aspect 宽高比: 相机的宽高比
    near 近剪裁平面: 任何比这更靠近相机的东西都是不可见的
    far 远剪裁平面: 任何比这更远的东西都是不可见的
*/
// 这四个参数一起用于创建一个有边界的空间区域, 称为 视椎体
const fov = 35
const aspect = container.clientWidth / container.clientHeight
const near = 0.1
const far = 100
const camera = new PerspectiveCamera(fov, aspect, near, far)

// 设置相机的位置
camera.position.set(0, 0, 10)

// 场景, 相机, 渲染器 是基础, 但是不可见

// 创建一个可见对象 mesh, 网格有两个需要创建的子组件: 几何体和材质
// 1. 几何体
const geometry = new BoxGeometry(2, 2, 2)
// 2. 材质
const material = new MeshBasicMaterial({ color: 0x00ff00 })

const cubemesh = new Mesh(geometry, material)

// 一旦网格被添加到场景中，我们称网格为场景的 子节点，我们称场景为网格的 父节点
scene.add(cubemesh)

// create the render
const renderer = new WebGLRenderer()
// 设置渲染器大小
renderer.setSize(container.clientWidth, container.clientHeight)
// 设置设备像素比
renderer.setPixelRatio(window.devicePixelRatio)

// 将 canvas 元素添加到页面中
container.appendChild(renderer.domElement)

// 渲染场景
renderer.render(scene, camera)