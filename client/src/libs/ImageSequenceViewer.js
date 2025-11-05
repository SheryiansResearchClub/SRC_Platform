import { createElem } from "./Utils"

export default class ImageSequenceViewer {
    constructor({ folderPath, ext, count, container, useCanvas = true }) {
        this.folderPath = folderPath
        this.ext = ext
        this.count = count
        this.container = container
        this.currentFrame = 0
        this.cache = new Map()
        this.useCanvas = useCanvas

        if (useCanvas) {
            this.canvas = createElem('.image-sequence-view', this.container, 'canvas')
            this.ctx = this.canvas.getContext('2d')
            this.setCanvasSize()
            new ResizeObserver(() => this.setCanvasSize()).observe(this.container)
        } else {
            this.img = createElem('.image-sequence-view', this.container, 'img')
            this.img.style.width = '100%'
            this.img.style.height = '100%'
            this.img.style.objectFit = 'cover'
        }
    }

    setCanvasSize() {
        if (!this.useCanvas) return

        const { width, height } = this.container.getBoundingClientRect()
        const ratio = window.devicePixelRatio || 1
        this.canvas.style.width = width + 'px'
        this.canvas.style.height = height + 'px'
        this.canvas.width = width * ratio
        this.canvas.height = height * ratio
        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        if (this.cache.has(this.currentFrame)) {
            this.drawImage(this.cache.get(this.currentFrame))
        }
    }

    getImagePath(index) {
        return `${this.folderPath}/${index}.${this.ext}`
    }

    drawImage(img) {
        if (!this.useCanvas) return

        const cw = this.canvas.width / (window.devicePixelRatio || 1)
        const ch = this.canvas.height / (window.devicePixelRatio || 1)
        const iw = img.width
        const ih = img.height
        const cr = cw / ch
        const ir = iw / ih

        let sx = 0, sy = 0, sw = iw, sh = ih

        if (ir > cr) {
            sw = ih * cr
            sx = (iw - sw) / 2
        } else {
            sh = iw / cr
            sy = (ih - sh) / 2
        }

        this.ctx.clearRect(0, 0, cw, ch)
        this.ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
    }

    loadImage(index) {
        return new Promise(resolve => {
            if (this.cache.has(index)) {
                resolve(this.cache.get(index))
                return
            }
            const img = new Image()
            img.onload = () => {
                this.cache.set(index, img)
                resolve(img)
            }
            img.src = this.getImagePath(index)
        })
    }

    async setFrame(index) {
        if (index < 0 || index >= this.count + 1) return
        this.currentFrame = index
        const img = await this.loadImage(index)

        if (this.useCanvas) {
            this.drawImage(img)
        } else {
            this.img.src = img.src
        }
    }
}