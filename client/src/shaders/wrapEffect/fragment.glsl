uniform vec3 uColor;
uniform sampler2D uTexture;
uniform float uRadius;
uniform float uRadiusEnd;
uniform float uTextureAspect;

uniform float Ufade;

uniform float uColorOffset;

varying vec2 vUv;
varying vec2 vElemSize;
varying float vProgress;

float linearStep(float edge0, float edge1, float x) {
    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float getRoundedCornerMask(vec2 uv, vec2 size, float radius, float ratio) {
    vec2 halfSize = size * 0.5;
    float t = ratio * length(halfSize);
    radius = mix(min(halfSize.x, halfSize.y) * linearStep(0.0, min(halfSize.x, halfSize.y), t), radius, linearStep(max(halfSize.x, halfSize.y), length(halfSize), t));
    halfSize = min(halfSize, vec2(t));
    return smoothstep(0.0, -fwidth(sdRoundedBox((uv - 0.5) * vElemSize, halfSize, radius)), sdRoundedBox((uv - 0.5) * vElemSize, halfSize, radius));
}

void main() {
    
    float scale = (vElemSize.x / vElemSize.y) / uTextureAspect;
    vec2 newUV = mix(vec2((vUv.x - 0.5) * scale + 0.5, vUv.y), vec2(vUv.x, (vUv.y - 0.5) / scale + 0.5), step(1.0, scale));
    float imageAlpha = getRoundedCornerMask(vUv, vElemSize, mix(uRadius, uRadiusEnd, vProgress), 1.0);
    vec3 color = texture2D(uTexture, newUV).rgb;
    gl_FragColor = vec4(mix(max(uColor, vec3(dot(color, vec3(0.299, 0.587, 0.114)))), color, vProgress + (uColorOffset * (1.0 - vProgress))), imageAlpha);
    gl_FragColor.a *= 1.0 - Ufade;
}
