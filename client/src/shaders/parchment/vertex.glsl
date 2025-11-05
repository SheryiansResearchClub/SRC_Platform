uniform float uProgress, uRadius, uRolls;
uniform bool uReverse, uVertical;
varying vec2 vUv;
varying float vFrontShadow;

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

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;
  float pi = 3.14159265359;
  float finalAngle = uVertical ? pi / 2. : 0.0;

  bool reverse = uVertical ? !uReverse : uReverse;

  vec3 newposition = position;

  newposition = rotate(newposition - vec3(-.5, .5, 0.), vec3(0., 0., 1.), -finalAngle) + vec3(-.5, .5, 0.);
  float offs = (newposition.x + 0.5) / (sin(finalAngle) + cos(finalAngle));

  float tProgress = clamp((uProgress - offs * 0.99) / 0.01, 0., 1.);

  float shadowEdge = (1.0 - uProgress) * (uRadius);
  vFrontShadow = smoothstep(shadowEdge - 0.05, shadowEdge + 0.05, uProgress - offs);

  newposition.z = uRadius + uRadius * (1. - offs / 2.) * sin(-offs * uRolls * pi - 0.5 * pi);
  newposition.x = -0.5 + uRadius * (1. - offs / 2.) * cos(-offs * uRolls * pi + 0.5 * pi);

  newposition = rotate(newposition - vec3(-.5, .5, 0.), vec3(0., 0., 1.), finalAngle) + vec3(-.5, .5, 0.);
  newposition = rotate(newposition - vec3(-.5, 0.5, uRadius), vec3(sin(finalAngle), cos(finalAngle), 0.), -pi * uProgress * uRolls);

  newposition += vec3(-0.5 + uProgress * cos(finalAngle) * (sin(finalAngle) + cos(finalAngle)), 0.5 - uProgress * sin(finalAngle) * (sin(finalAngle) + cos(finalAngle)), uRadius * (1. - uProgress / 2.));

  vec3 finalposition = mix(newposition, position, tProgress);
  finalposition = rotate(finalposition, vec3(0., 0., 1.), reverse ? pi : 0.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(getPosition(finalposition), 1.0);
}
