import gsap from "gsap";

export default class MouseFollower {
    constructor(elem, mouse) {
        this.elem = elem;
        this.mouse = mouse;
        this.data = {
            current: { x: 0, y: 0 },
            last: { x: 0, y: 0 },
            button: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            rotation: 0,
            spring: { position: 0, velocity: 0, target: 0 }
        };
    }

    update() {
        const { x, y } = this.mouse;
        this.data.current = { x, y };
        this.data.velocity = {
            x: x - this.data.last.x,
            y: y - this.data.last.y
        };
        this.data.last = { x, y };

        this.data.spring.velocity += (1 - this.data.spring.position) * 1.3;
        this.data.spring.velocity *= 0.8;
        this.data.spring.position += this.data.spring.velocity;

        this.data.button.x += (this.data.current.x - this.data.button.x) * 0.1;
        this.data.button.y += (this.data.current.y - this.data.button.y) * 0.1;

        const vel = Math.sqrt((this.data.velocity.x ** 2 / 10) + this.data.velocity.y ** 2);
        this.data.rotation += (vel * 5 - this.data.rotation) * 0.1;

        gsap.set(this.elem, {
            left: x,
            top: y + Math.sin(this.data.spring.position * Math.PI) * 10,
            xPercent: -50,
            yPercent: -50,
        });

        gsap.to(this.elem, {
            duration: 3,
            rotation: this.data.rotation * Math.sign(this.data.velocity.x) * .4,
            ease: "elastic.out(1, 0.1)"
        });

        gsap.to(this.elem, {
            duration: 6,
            scale: 1 + Math.min(5, (vel / 30) * this.data.spring.position),
            ease: "elastic.out(1, 0.1)"
        });

        // Dampen the velocity to gradually lower the effect over time
        this.data.velocity.x *= 0.95;
        this.data.velocity.y *= 0.95;
    }
}