uniform sampler2D uTexture;
uniform float uTextureAspect;
uniform vec2 uElemSize;
uniform float uProgress;

varying vec2 vUv;

void main() {
    float fade = max(abs(uProgress) - 1., 0.);
    float scale = (uElemSize.x / uElemSize.y) / uTextureAspect;
    vec2 newUV = mix(vec2((vUv.x - 0.5) * scale + 0.5, vUv.y), vec2(vUv.x, (vUv.y - 0.5) / scale + 0.5), step(1.0, scale));
    vec4 texture = texture2D(uTexture, newUV);
    gl_FragColor = vec4(texture.rgb, texture.a * (1.0 - fade));
}