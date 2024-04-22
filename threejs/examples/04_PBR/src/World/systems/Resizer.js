class Resizer {
    constructor(container, camera, renderer) {
        camera.aspect = container.clientWidth / container.clientHeight

        // 更改相机的 fov, aspect, near and far, 需要更新平截头体
        camera.updateProjectionMatrix()

        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
    }
}

export { Resizer }