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
