// ParchmentTexture.js
import * as THREE from "three"
import { Text } from "troika-three-text"

export default class ParchmentTexture {
    constructor(renderer, bgTexture, text, {
        heading = "Scroll of Wisdom",
        width = 1024,
        height = 1024,
        fontSize = 3,
        headingSize = 5,
        color = "#E3f100",
        headingColor = "#E3f100",
        textAlign = "left",
    } = {}) {
        this.renderer = renderer
        this.bgTexture = bgTexture
        this.fullText = text

        // store base dimensions and font sizes
        this.baseWidth = width
        this.baseHeight = height
        this.baseFontSize = fontSize
        this.baseHeadingSize = headingSize
        this.color = color
        this.headingColor = headingColor
        this.textAlign = textAlign

        this.width = width
        this.height = height

        this._setupScene(heading)
    }

    _setupScene(heading) {
        // render target
        this.rt = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        })

        // scene + camera
        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera(
            -this.width / 2,
            this.width / 2,
            this.height / 2,
            -this.height / 2,
            0.1,
            1000
        )
        this.camera.position.z = 10

        // background plane
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshBasicMaterial({ map: this.bgTexture })
        )
        this.scene.add(this.plane)

        // heading text (top-center)
        this.headingText = new Text()
        this.headingText.text = heading
        this.headingText.font = '/fonts/Saphifen.ttf'
        this.headingText.anchorX = "center"
        this.headingText.anchorY = "top"
        this.headingText.color = this.headingColor
        this.scene.add(this.headingText)

        // body text (top-left)
        this.troikaText = new Text()
        this.troikaText.font = '/fonts/Sekaiwo.ttf'
        this.troikaText.color = this.color
        this.troikaText.anchorX = "left"
        this.troikaText.anchorY = "top"
        this.troikaText.textAlign = this.textAlign
        this.troikaText.lineHeight = 1.15
        this.troikaText.overflowWrap = "break-word"
        this.troikaText.text = ""
        this.scene.add(this.troikaText)

        // apply responsive sizes and positions
        this._applyResponsiveSizes()
        this._syncAndRender()
    }

    _applyResponsiveSizes() {
        // svmax logic: scale fonts relative to largest dimension
        const svmax = Math.max(this.width, this.height) / 100

        this.headingText.fontSize = this.baseHeadingSize * svmax
        this.troikaText.fontSize = this.baseFontSize * svmax

        // padding based on width
        this.padding = this.troikaText.fontSize * 2
        this.headingPadding = this.headingText.fontSize

        if (this.width < 500) {
            this.headingPadding *= 1.5
        }

        this.troikaText.maxWidth = this.width - this.padding * 2

        // heading top-center using height
        this.headingText.position.set(0, this.height / 2 - this.headingPadding, 0)

        // body text top-left under heading
        this.troikaText.position.set(-this.width / 2 + this.padding, this.height / 2 - this.padding - this.headingPadding , 0)
    }

    async _syncAndRender() {
        await Promise.all([
            new Promise(r => this.headingText.sync(r)),
            new Promise(r => this.troikaText.sync(r))
        ])
        this.render()
    }

    async update(progress) {
        const visibleChars = Math.floor(this.fullText.length * progress)
        const newText = this.fullText.substring(0, visibleChars)
        if (newText !== this.troikaText.text) {
            this.troikaText.text = newText
            await new Promise(r => this.troikaText.sync(r))
            this.render()
        }
    }

    render() {
        this.renderer.setRenderTarget(this.rt)
        this.renderer.render(this.scene, this.camera)
        this.renderer.setRenderTarget(null)
    }

    get texture() {
        return this.rt.texture
    }

    async resize(width, height) {
        this.width = width
        this.height = height

        // update render target
        this.rt.setSize(width, height)

        // update camera
        this.camera.left = -width / 2
        this.camera.right = width / 2
        this.camera.top = height / 2
        this.camera.bottom = -height / 2
        this.camera.updateProjectionMatrix()

        // update background plane
        this.plane.geometry.dispose()
        this.plane.geometry = new THREE.PlaneGeometry(width, height)

        // update responsive font sizes & positions
        this._applyResponsiveSizes()
        await this._syncAndRender()
    }
}
