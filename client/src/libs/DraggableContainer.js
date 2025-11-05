import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

export class DraggableContainer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.draggables = Array.from(this.container.children);
        this.instances = [];
        this.randomInterval = 3000;
        this.randomTimer = 0;
        this.randomEnabled = false;
        this.currentElem = null;

        this.initAll();
        window.addEventListener("resize", () => this.instances.forEach(i => i.align()));
    }

    initAll() {

        const size = {
            width: innerWidth,
            height: innerHeight * .5
        }

        const config = [
            {
                x: size.width * 0.80,
                y: size.height * 0.20,
            },
            {
                x: size.width * 0.05,
                y: size.height * 0.20,
            },
            {
                x: size.width * 0.17,
                y: size.height * 0.50,
            },
            {
                x: size.width * 0.65,
                y: size.height * 0.50,
            }
        ];

        this.draggables.forEach((el, i) => {
            const inst = new GSAPDraggableWrapper(el, this.container);
            this.instances.push(inst);
            requestAnimationFrame(() => {
                const configIndex = i % config.length;
                gsap.to(inst.proxy, {
                    duration: 1.2,
                    x: config[configIndex].x,
                    y: config[configIndex].y,
                    ease: "power2.out",
                    onUpdate: () => {
                        inst.xTo(gsap.getProperty(inst.proxy, "x"));
                        inst.yTo(gsap.getProperty(inst.proxy, "y"));
                    },
                    onComplete: () => {
                        inst.skewTo(0);
                    }
                });
            });
        });
    }

    getRandomInstance() {
        let inst;
        do {
            inst = this.instances[Math.floor(Math.random() * this.instances.length)];
        } while (inst === this.currentElem && this.instances.length > 1);
        this.currentElem = inst;
        return inst;
    }

    update(deltaTime) {
        if (!this.randomEnabled) return;
        this.randomTimer += deltaTime;
        if (this.randomTimer >= this.randomInterval) {
            this.randomTimer -= this.randomInterval;
            const inst = this.getRandomInstance();
            const bounds = inst.getBounds();

            const currentX = gsap.getProperty(inst.proxy, "x");
            const currentY = gsap.getProperty(inst.proxy, "y");

            const offset = this.rand(150, 300);
            const dirX = currentX < bounds.width / 2 ? 1 : -1;
            const dirY = currentY < bounds.height / 2 ? 1 : -1;

            let targetX = currentX + dirX * offset;
            let targetY = currentY + dirY * offset;

            targetX = Math.max(bounds.left, Math.min(targetX, bounds.width));
            targetY = Math.max(bounds.top, Math.min(targetY, bounds.height));

            inst.moveTo(targetX, targetY);
        }
    }

    rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    start() {
        this.randomEnabled = true;
        this.randomTimer = this.randomInterval;
    }

    stop() {
        this.randomEnabled = false;
    }
}

class GSAPDraggableWrapper {
    constructor(element, container) {
        this.element = element;
        this.container = container;
        this.proxy = document.createElement("div");
        this.clampSkew = gsap.utils.clamp(-20, 20);

        this.skewTo = gsap.quickTo(element, "skewX", { duration: 0.3 });
        this.xTo = gsap.quickTo(element, "x", { duration: 0.5, ease: "power2.out" });
        this.yTo = gsap.quickTo(element, "y", { duration: 0.5, ease: "power2.out" });

        this.proxy.style.position = "absolute";
        element.parentNode.appendChild(this.proxy);

        this.drag = Draggable.create(this.proxy, {
            type: "x,y",
            trigger: element,
            bounds: container,
            edgeResistance: 0.15,
            inertia: true,
            onPressInit: () => {
                this.align();
                this.xTo.tween?.pause();
                this.yTo.tween?.pause();
                gsap.ticker.add(this.updateSkew);
            },
            onPress: () => {
                element.style.zIndex = this.proxy.style.zIndex;
            },
            onDrag: () => {
                this.xTo(this.drag.x);
                this.yTo(this.drag.y);
            },
            onThrowUpdate: () => {
                this.xTo(this.drag.x);
                this.yTo(this.drag.y);
            }
        })[0];

        this.tracker = InertiaPlugin.track(this.proxy, "x,y")[0];

        this.updateSkew = () => {
            const vx = this.tracker.get("x");
            this.skewTo(this.clampSkew(vx / -50));
            if (!vx && !this.drag.isPressed) {
                gsap.ticker.remove(this.updateSkew);
            }
        };
    }

    align() {
        gsap.set(this.proxy, {
            x: gsap.getProperty(this.element, "x"),
            y: gsap.getProperty(this.element, "y"),
            width: this.element.offsetWidth,
            height: this.element.offsetHeight,
            pointerEvents: "none",
            top: 0,
            left: 0,
            zIndex: 0
        });
    }

    getBounds() {
        const rect = this.container.getBoundingClientRect();
        return {
            top: 0,
            left: 0,
            width: rect.width - this.element.offsetWidth,
            height: rect.height - this.element.offsetHeight
        };
    }

    moveTo(x, y) {
        const bounds = this.getBounds();
        const clampedX = Math.max(bounds.left, Math.min(x, bounds.width));
        const clampedY = Math.max(bounds.top, Math.min(y, bounds.height));


        gsap.to(this.proxy, {
            duration: 1.2,
            x: clampedX,
            y: clampedY,
            ease: "power2.out",
            onUpdate: () => {
                this.xTo(gsap.getProperty(this.proxy, "x"));
                this.yTo(gsap.getProperty(this.proxy, "y"));
            },
            onComplete: () => {
                this.skewTo(0);
            }
        });
    }
}
