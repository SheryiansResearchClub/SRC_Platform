uniform sampler2D uTexture, uTextureBack;
uniform vec2 uElemSize;
varying vec2 vUv;
uniform float uEdgeRoughness, uEdgeWidth, uTextureAspect;
varying float vFrontShadow;
uniform bool uReverse,uVertical;

// ------------------ Noise & FBM ------------------
// Cheaper 1D noise/FBM for edge jaggedness (we only vary along one axis)
float hash1(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise1D(float x) {
    float i = floor(x);
    float f = fract(x);
    float a = hash1(i);
    float b = hash1(i + 1.0);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u);
}

float fbm1D(float x) {
    float v = 0.0;
    float a = 0.5;
    for(int i = 0; i < 5; i++) {
        v += a * noise1D(x);
        x *= 2.0;
        a *= 0.5;
    }
    return v;
}
// -------------------------------------------------
void main() {
    // --- Handle reverse flag (rotate 180°) ---
    vec2 baseUV = vec2(vUv.x, 1.0 - vUv.y);

    bool reverse = uVertical ? !uReverse : uReverse;

    if(reverse) {
        baseUV = vec2(1.0 - baseUV.x, 1.0 - baseUV.y);
    }

    // --- Fit texture into element with aspect ratio preserved ---
    float scale = (uElemSize.x / uElemSize.y) / uTextureAspect;
    vec2 newUV = mix(vec2((baseUV.x - 0.5) * scale + 0.5, baseUV.y),           // horizontal fit
    vec2(baseUV.x, (baseUV.y - 0.5) / scale + 0.5),           // vertical fit
    step(1.0, scale));

    // sample texture

    vec4 tex = !gl_FrontFacing ? texture2D(uTexture, newUV) : texture2D(uTextureBack, newUV);

    // Only apply shadow on the front face
    if(!gl_FrontFacing) {
        tex.rgb *= clamp(vFrontShadow, 0.7, 1.0);
    }

    // --- Torn edge mask ---
    const float NOISE_SCALE = 10.0;
    float nx = fbm1D(newUV.y * NOISE_SCALE) * uEdgeRoughness;
    float ny = fbm1D(newUV.x * NOISE_SCALE + 100.0) * uEdgeRoughness;

    float left = baseUV.x - (uEdgeWidth + nx);
    float right = (1.0 - (uEdgeWidth + nx)) - baseUV.x;
    float bottom = baseUV.y - (uEdgeWidth + ny);
    float top = (1.0 - (uEdgeWidth + ny)) - baseUV.y;
    float edgeMin = min(min(left, right), min(bottom, top));
    if(edgeMin < 0.0)
        discard;

    gl_FragColor = tex;
}
