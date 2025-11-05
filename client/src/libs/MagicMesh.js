import * as THREE from "three";

export default class MagicMesh extends THREE.Mesh {
    pos = new THREE.Vector2();
    size = new THREE.Vector2();
    _targetPos = new THREE.Vector2();
    _targetSize = new THREE.Vector2();
    tick = 0;
    progress = 0;

    useCssTransform = true;
    useNestedCss = true;

    constructor({ geometry, material, segments = [1, 1], elem, transition, targetZ, useCssTransform, useNestedCss, ...opts } = {}) {
        const geom = geometry || new THREE.PlaneGeometry(1, 1, ...segments);
        super(geom, opts.material);

        this.elem = elem;
        this.anchor = new THREE.Vector2(0.5, 0.5);
        this.matrixAutoUpdate = false;
        this.frustumCulled = false;

        this.useCssTransform = useCssTransform !== undefined ? useCssTransform : true;
        this.useNestedCss = useNestedCss !== undefined ? useNestedCss : true;

        this.lerpAlpha = 0.4;

        this.material = material

        this.targetZ = targetZ;

        if (transition) {
            const mapping = {
                hWave: "uHorizontalWaveStrength",
                rWave: "uRotationalWaveStrength",
                xStart: "uDistortionCurveXStart",
                xEnd: "uDistortionCurveXEnd",
                yStart: "uDistortionCurveYStart",
                yEnd: "uDistortionCurveYEnd",
                xScale: "uPositionScaleX",
                xShift: "uPositionShiftX",
                yScale: "uPositionScaleY",
                yShift: "uPositionShiftY"
            };

            this.transition = new Proxy(transition, {
                set: (target, key, value) => {
                    target[key] = value;
                    if (this.material?.uniforms && mapping[key]) {
                        this.material.uniforms[mapping[key]].value = value;
                    }
                    return true;
                },
                get: (target, key) => target[key]
            });

        } else {
            this.transition = transition;
        }

        this.initMaterial(opts);
    }

    initMaterial({ vertexShader, fragmentShader, uniforms = {}, ...opts } = {}) {
        const def = v => ({ value: v });
        const defaultUniforms = {
            uElemPos: def(new THREE.Vector2()),
            uElemSize: def(new THREE.Vector2()),
            uElemAngle: def(0),
            uElemZ: def(0),
            uElemScale: def(new THREE.Vector2(1, 1)),
            uElemAnchor: def(new THREE.Vector2()),
            uTargetElemPos: def(new THREE.Vector2()),
            uTargetElemSize: def(new THREE.Vector2()),
            uTargetElemAngle: def(0),
            uTargetElemZ: def(0),
            uTargetElemScale: def(new THREE.Vector2(1, 1)),
            uTargetElemAnchor: def(new THREE.Vector2()),
            uIsAnimatedElemMesh: def(!!(this.transition && this.transition.targetElem)),
            uElemTransitionProgress: def(0),
        };

        if (this.transition) {
            const { hWave, rWave, xStart, xEnd, yStart, yEnd, xScale, xShift, yScale, yShift } = this.transition;
            Object.assign(defaultUniforms, {
                uHorizontalWaveStrength: { value: hWave || 0 },
                uRotationalWaveStrength: { value: rWave || 0 },
                uDistortionCurveXStart: { value: xStart || -1 },
                uDistortionCurveXEnd: { value: xEnd || 5 },
                uDistortionCurveYStart: { value: yStart || -1 },
                uDistortionCurveYEnd: { value: yEnd || 5 },
                uPositionScaleX: { value: xScale || 0.5 },
                uPositionShiftX: { value: xShift || 0.5 },
                uPositionScaleY: { value: yScale || 0.5 },
                uPositionShiftY: { value: yShift || 0.5 },
            });
        }


        if (!this.material) {
            this.material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                transparent: true,
                ...opts,
            });
        }

        Object.assign(this.material.uniforms, { ...defaultUniforms, ...uniforms });
    }


    getCumulativeTransform(elem) {
        let rot = 0, sx = 1, sy = 1, sz = 1, z = 0;
        let el = elem;

        if (this.useCssTransform)
            if (this.useNestedCss)
                while (el) {
                    getSingleTransform(el)
                    el = el.parentElement;
                }
            else getSingleTransform(el);

        function getSingleTransform(el) {
            const style = el.ownerDocument?.defaultView?.getComputedStyle(el);
            const transform = style?.transform || style?.webkitTransform;
            if (transform && transform !== "none") {
                const matrix3d = transform.match(/matrix3d\(([^)]+)\)/);
                if (matrix3d) {
                    const m = matrix3d[1].split(",").map(parseFloat);
                    z += m[14];
                    sx *= Math.hypot(m[0], m[1], m[2]);
                    sy *= Math.hypot(m[4], m[5], m[6]);
                    sz *= Math.hypot(m[8], m[9], m[10]);
                    rot += Math.atan2(m[1], m[0]);
                } else {
                    const matrix2d = transform.match(/matrix\(([^)]+)\)/);
                    if (matrix2d) {
                        const [a, b, c, d] = matrix2d[1].split(",").map(parseFloat);
                        rot += Math.atan2(b, a);
                        sx *= Math.hypot(a, b);
                        sy *= Math.hypot(c, d);
                    }
                }
            }
        }

        return { rotation: rot, scaleX: sx, scaleY: sy, scaleZ: sz, translateZ: z };
    }

    update(offsetX = 0, offsetY = 0) {
        if (!this.elem) return;

        const rect = this.elem.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const cx = left + width / 2;
        const cy = top + height / 2;

        const posX = cx - this.elem.offsetWidth / 2 - innerWidth / 2 + offsetX;
        const posY = cy - this.elem.offsetHeight / 2 - innerHeight / 2 + offsetY;

        const { rotation, scaleX, scaleY, translateZ } = this.getCumulativeTransform(this.elem);

        const u = this.material.uniforms;

        // Direct set
        u.uElemZ.value = translateZ / 1000;
        u.uElemScale.value.set(scaleX, scaleY);
        u.uElemAngle.value = rotation;

        // Lerp values
        const targetPos = new THREE.Vector2(posX, posY);
        const targetSize = new THREE.Vector2(this.elem.offsetWidth, this.elem.offsetHeight);
        const targetAnchor = new THREE.Vector2(
            targetSize.x * this.anchor.x,
            targetSize.y * this.anchor.y
        );

        u.uElemPos.value.lerp(targetPos, this.lerpAlpha);
        u.uElemSize.value.lerp(targetSize, this.lerpAlpha);
        u.uElemAnchor.value.lerp(targetAnchor, this.lerpAlpha);

        if (this.transition && this.transition.targetElem) {
            const target = this.transition.targetElem;
            const rectTarget = target.getBoundingClientRect();
            const { width: tW, height: tH, left: tLeft, top: tTop } = rectTarget;
            const cxTarget = tLeft + tW / 2;
            const cyTarget = tTop + tH / 2;
            const tPosX = cxTarget - tW / 2 - innerWidth / 2;
            const tPosY = cyTarget - tH / 2 - innerHeight / 2;

            const { rotation: tRot, scaleX: tSX, scaleY: tSY, translateZ: tTZ } = this.getCumulativeTransform(target);

            // Direct set
            u.uTargetElemZ.value = this.targetZ || tTZ / 1000;
            u.uTargetElemScale.value.set(tSX, tSY);
            u.uTargetElemAngle.value = tRot;

            // Lerp values
            const tTargetPos = new THREE.Vector2(tPosX, tPosY);
            const tTargetSize = new THREE.Vector2(tW, tH);
            const tTargetAnchor = new THREE.Vector2(
                tTargetSize.x * this.anchor.x,
                tTargetSize.y * this.anchor.y
            );

            u.uTargetElemPos.value.lerp(tTargetPos, this.lerpAlpha);
            u.uTargetElemSize.value.lerp(tTargetSize, this.lerpAlpha);
            u.uTargetElemAnchor.value.lerp(tTargetAnchor, this.lerpAlpha);
        }

        u.uElemTransitionProgress.value = this.progress;
        this.tick++;
    }

    setProgress(p) {
        this.progress = p;
    }
}
