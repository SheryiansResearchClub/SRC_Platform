uniform float uProgress;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uStrength;
varying vec2 vUv;

// --- Inlined common/domSyncPosition.glsl ---
uniform vec2 uElemPos, uElemSize, uElemScale, uElemAnchor;
uniform float uElemAngle, uElemZ;
uniform vec2 uTargetElemPos, uTargetElemSize, uTargetElemScale, uTargetElemAnchor;
uniform float uTargetElemAngle, uTargetElemZ;
uniform bool uIsAnimatedElemMesh;
uniform float uElemTransitionProgress;
uniform float uDistortionCurveXStart, uDistortionCurveYStart, uDistortionCurveXEnd, uDistortionCurveYEnd;
uniform float uPositionScaleX, uPositionScaleY, uPositionShiftX, uPositionShiftY;
uniform float uHorizontalWaveStrength, uRotationalWaveStrength;

varying float vProgress;
varying vec2 vElemSize;

const float TAU = 6.28318530718;
const vec3 FLIP_Y = vec3(1.0, -1.0, 1.0);

vec3 qrotate(vec4 q, vec3 v) {
    vec3 qv = cross(q.xyz, v);
    return v + 2.0 * cross(q.xyz, qv + q.w * v);
}

vec3 transformLocal(vec3 pos, vec2 size, vec2 scale, float angle, vec2 anchor) {
    vec2 local = pos.xy * size - anchor;
    vec2 scaled = local * scale;
    float cosA = cos(angle), sinA = sin(angle);
    vec2 rotated = vec2(dot(scaled, vec2(cosA, -sinA)), dot(scaled, vec2(sinA, cosA)));
    return vec3(rotated, pos.z);
}

vec3 getStaticPosition(vec3 pos) {
    vec3 base = transformLocal(pos, uElemSize, uElemScale, uElemAngle, uElemAnchor);
    vElemSize = uElemSize;
    return vec3(base.xy + uElemAnchor + uElemPos, pos.z + uElemZ) * FLIP_Y;
}

vec3 getAnimatedTransformedPosition(vec3 pos) {
    float xPos = pos.x * uPositionScaleX + uPositionShiftX;
    float yPos = pos.y * uPositionScaleY + uPositionShiftY;
    float weight = 2.0 - 0.5 * (pow(xPos, uDistortionCurveXStart) + pow(xPos, uDistortionCurveXEnd) + pow(yPos, uDistortionCurveYStart) + pow(yPos, uDistortionCurveYEnd));
    float smoothP = smoothstep(weight * 0.3, 0.7 + weight * 0.3, uElemTransitionProgress);
    vProgress = smoothP;

    vec2 currPos = mix(uElemPos, uTargetElemPos, smoothP);
    vec2 currSize = mix(uElemSize, uTargetElemSize, smoothP);
    vec2 currScale = mix(uElemScale, uTargetElemScale, smoothP);
    float currAngle = mix(uElemAngle, uTargetElemAngle, smoothP);
    float currZ = mix(uElemZ, uTargetElemZ, smoothP);
    vec2 currAnchor = mix(uElemAnchor, uTargetElemAnchor, smoothP);

    currPos.x += uHorizontalWaveStrength * mix(currSize.x, 0.0, 0.5 + 0.5 * cos(smoothP * TAU));

    vec3 base = transformLocal(pos, currSize, currScale, currAngle, currAnchor);
    float twistAngle = uRotationalWaveStrength * (smoothstep(0.0, 1.0, smoothP) - smoothP);
    vec4 q = vec4(0.0, 0.0, sin(twistAngle), cos(twistAngle));
    vec3 twisted = qrotate(q, base);

    vElemSize = currSize;
    return (twisted + vec3(currAnchor + currPos, pos.z + currZ)) * FLIP_Y;
}

vec3 getPosition(vec3 pos) {
    pos.xy += 0.5;
    return uIsAnimatedElemMesh ? getAnimatedTransformedPosition(pos) : getStaticPosition(pos);
}
// --- End inlined common ---

vec2 applyCurl(float y, bool isPositive, float pivot, float halfPi, float absTime, out float zOffset) {
    float from = isPositive ? (pivot - y) : (y - pivot);
    float eased = max(0.0, from);
    float influence = pow(smoothstep(0.0, 3.0, eased), 1.5);
    float angle = halfPi * influence * absTime * 10.0;
    zOffset = 0.0;

    if(from > 0.0 && angle != 0.0) {
        float radius = from / angle;
        float newY = radius * sin(angle);
        zOffset = radius * (1.0 - cos(angle));
        return vec2(isPositive ? (pivot - newY) : (pivot + newY), 1.0);
    }

    return vec2(y, 0.0);
}
void curlPlane(inout vec3 pos, inout vec2 uv) {
    pos.xy += .5;

    float progress = abs(uProgress);
    progress = step(0.01, progress) * progress + (1.0 - step(0.01, progress)) * floor(progress * 100.0) * 0.01;
    bool isPositive = uProgress >= 0.0;

    float zOffset;
    vec2 newY = applyCurl(pos.y, isPositive, isPositive ? 1.0 : 0.0, 1.57079632679, progress, zOffset);
    pos.y = newY.x;
    pos.z += zOffset;

    vec2 newUv = applyCurl(uv.y, isPositive, isPositive ? 1.0 : 0.0, 1.57079632679, progress, zOffset);
    uv.y = newUv.x;

    pos.xy -= .5;
}

void mouseDistort(inout vec3 pos, vec2 uv) {
    pos.z += uStrength * 0.5;
    float dist = distance(uv, uMouse);
    float influence = -smoothstep(0.0, uRadius, dist) * 0.5;
    pos.z += influence * uStrength;
}

void main() {
    vec3 pos = position;
    vec2 uv2 = uv;
    curlPlane(pos, uv2);
    mouseDistort(pos, uv2);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(getPosition(pos), 1.0);
    vUv = vec2(uv.x, 1.0 - uv.y);
}