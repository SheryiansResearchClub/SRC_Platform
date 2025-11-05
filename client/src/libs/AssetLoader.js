import * as THREE from "three";
import { OdometerLite } from "./Odometer";
import { createElem, get } from "./Utils";

export default class AssetLoader {
  constructor(resources) {
    this.resources = resources;
    this.cache = {
      images: {},
      fonts: {},
      videos: {},
      videoTextures: {},
      audios: {}
    };
    this.loadingManager = new THREE.LoadingManager();
    
    // Try to find the progress meter element, but don't fail if it doesn't exist
    const progressMeterEl = get(".loader .progress-meter");
    if (progressMeterEl) {
      this.progressMeter = new OdometerLite(progressMeterEl);
      this.progressMeter.setValue(8);
    } else {
      this.progressMeter = null;
    }

    this.loadingManager.onProgress = (_, loaded, total) => {
      if (this.progressMeter) {
        this.progressMeter.setValue(Math.round((loaded / total) * 100));
      }
    };
  }

  getCacheItem(path) {
    // Determine type from path extension
    const ext = path.split('.').pop().toLowerCase();

    if (ext === 'mp3' || ext === 'wav') {
      return this.cache.audios[path];
    } else if (ext === 'mp4' || ext === 'webm') {
      return {
        video: this.cache.videos[path],
        videoTexture: this.cache.videoTextures[path]
      };
    } else if (ext === 'jpg' || ext === 'png' || ext === 'jpeg' || ext === 'webp') {
      return this.cache.images[path];
    }

    // For fonts, try to find by path
    for (const key in this.cache.fonts) {
      if (key.includes(path)) return this.cache.fonts[key];
    }

    return null;
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      if (this.cache.images[src]) return resolve(this.cache.images[src]);

      this.loadingManager.itemStart(src);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        this.cache.images[src] = texture;
        this.loadingManager.itemEnd(src);
        resolve(texture);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        this.loadingManager.itemEnd(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
    });
  }

  loadFont({ name, url, weight = "normal" }) {
    return new Promise((resolve, reject) => {
      const key = `${name}-${weight}`;
      if (this.cache.fonts[key]) return resolve(this.cache.fonts[key]);

      this.loadingManager.itemStart(url);
      const fontFace = new FontFace(name, `url(${url})`, {
        weight,
        style: "normal"
      });
      fontFace
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          this.cache.fonts[key] = loadedFont;
          document.body.offsetHeight;
          const span = createElem("span");
          span.style.fontFamily = name;
          span.style.position = "absolute";
          span.style.opacity = "0";
          span.textContent = "A";
          document.body.appendChild(span);
          setTimeout(() => {
            span.remove();
            this.loadingManager.itemEnd(url);
            resolve(loadedFont);
          }, 10);
        })
        .catch((error) => {
          console.error(`Failed to load font: ${name} (${weight})`, error);
          this.loadingManager.itemEnd(url);
          reject(error);
        });
    });
  }

  loadVideo(src) {
    return new Promise((resolve, reject) => {
      if (this.cache.videos[src]) {
        return resolve({
          video: this.cache.videos[src],
          videoTexture: this.cache.videoTextures[src]
        });
      }
      this.loadingManager.itemStart(src);
      const video = document.createElement("video");
      video.src = src;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = "auto";


      video.addEventListener("loadeddata", () => {
        video.play()

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.needsUpdate = true;

        this.cache.videos[src] = video;
        this.cache.videoTextures[src] = videoTexture;

        this.loadingManager.itemEnd(src);
        resolve({ video, videoTexture });
      });

      video.addEventListener("error", () => {
        console.error(`Failed to load video: ${src}`);
        this.loadingManager.itemEnd(src);
        reject(new Error(`Failed to load video: ${src}`));
      });

      video.load();
    });
  }

  loadAudio(src, listener) {
    return new Promise((resolve, reject) => {
      if (this.cache.audios[src]) return resolve(this.cache.audios[src]);

      this.loadingManager.itemStart(src);
      const audioLoader = new THREE.AudioLoader(this.loadingManager);
      const audio = new THREE.Audio(listener);

      audioLoader.load(
        src,
        (buffer) => {
          audio.setBuffer(buffer);
          this.cache.audios[src] = audio;
          this.loadingManager.itemEnd(src);
          resolve(audio);
        },
        undefined,
        (error) => {
          console.error(`Failed to load audio: ${src}`, error);
          this.loadingManager.itemEnd(src);
          reject(error);
        }
      );
    });
  }

  async load() {
    const {
      images = [],
      fonts = [],
      videos = [],
      audios = []
    } = this.resources;

    const listener = new THREE.AudioListener();

    try {
      await Promise.all([
        ...images.map(src => this.loadImage(src)),
        ...fonts.map(font => this.loadFont(font)),
        ...videos.map(src => this.loadVideo(src)),
        ...audios.map(src => this.loadAudio(src, listener))
      ]);

      return {
        loadingManager: this.loadingManager,
        cache: this.getCacheItem.bind(this)
      };
    } catch (error) {
      console.error("Error during asset loading:", error);
      throw error;
    }
  }
}
