import React, { useEffect, useState, useRef } from "react";
import AssetLoader from "../../../libs/AssetLoader";
import { AssetsDatabase } from "../../../libs/Database";
import gsap from "gsap";
import { useThree } from "../three/ThreeScene";
import * as THREE from "three";
import MagicMesh from "../../../libs/MagicMesh";
import ParchmentTexture from "../../../libs/ParchmentTexture";
import wrapEffectVertex from "../../../shaders/wrapEffect/vertex.glsl";
import wrapEffectFragment from "../../../shaders/wrapEffect/fragment.glsl";
import parchmentVertex from "../../../shaders/parchment/vertex.glsl";
import parchmentFragment from "../../../shaders/parchment/fragment.glsl";

const Loader = ({ startRef, targetRef }) => {
  // const { registerMesh, unregisterMesh, renderer } = useThree();
  // const [videoTexture, setVideoTexture] = useState(null);
  // const [assetsReady, setAssetsReady] = useState(false);
  // const [removed, setRemoved] = useState(false);
  const loaderRef = useRef(null);
  // const reelMeshRef = useRef(null);
  // const reelTweenRef = useRef(null);
  // const createdTweensRef = useRef([]);
  // const createdMeshesRef = useRef([]);
  // const createdListenersRef = useRef([]);
  // const mountTimeRef = useRef(Date.now());

  // useEffect(() => {
  //   let mounted = true;
  //   if (!registerMesh) return;

  //   const loader = new AssetLoader(AssetsDatabase);
  //   // Load the showreel explicitly from the public folder so we don't rely on AssetsDatabase
  //   loader
  //     .loadVideo("/videos/showreel.mp4")
  //     .then(async ({ video, videoTexture }) => {
  //       if (!mounted) return;
  //       try {
  //         // Play video (muted) and ensure it's ready
  //         try {
  //           await video.play().catch(() => {});
  //         } catch (e) {}

  //         // Prepare shaders: vite-plugin-glsl handles includes automatically
  //         const vertexShader = wrapEffectVertex;
  //         const fragmentShader = wrapEffectFragment;

  //         // Prefer refs passed from HeroSection (robust wiring). If not provided,
  //         // fall back to brief DOM polling to preserve previous behavior.
  //         const waitFor = async (fn, timeout = 2000, interval = 50) => {
  //           const start = Date.now();
  //           while (Date.now() - start < timeout) {
  //             const result = fn();
  //             if (result) return result;
  //             // eslint-disable-next-line no-await-in-loop
  //             await new Promise((r) => setTimeout(r, interval));
  //           }
  //           return null;
  //         };

  //         const startEl =
  //           startRef && startRef.current
  //             ? startRef.current
  //             : await waitFor(
  //                 () =>
  //                   document.getElementById("small") ||
  //                   document.querySelector("#small")
  //               );
  //         const endEl =
  //           targetRef && targetRef.current
  //             ? targetRef.current
  //             : await waitFor(() => document.querySelector(".big"));
  //         if (!startEl || !endEl) {
  //           console.warn(
  //             "Loader: start or end element for reel not found after waiting",
  //             { startEl, endEl }
  //           );
  //         }

  //         // DEBUG: Log element dimensions
  //         if (startEl) {
  //           const rect = startEl.getBoundingClientRect();
  //           console.log("Loader: startEl dimensions", {
  //             offsetWidth: startEl.offsetWidth,
  //             offsetHeight: startEl.offsetHeight,
  //             clientWidth: startEl.clientWidth,
  //             clientHeight: startEl.clientHeight,
  //             boundingRect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left }
  //           });
  //           const computed = window.getComputedStyle(startEl);
  //           console.log("Loader: startEl computed style", {
  //             display: computed.display,
  //             position: computed.position,
  //             width: computed.width,
  //             height: computed.height,
  //             visibility: computed.visibility,
  //             opacity: computed.opacity
  //           });
  //         }

  //         console.log("Loader: Creating MagicMesh with elem:", startEl, "offsetWidth:", startEl?.offsetWidth, "offsetHeight:", startEl?.offsetHeight);

  //         const reelMesh = new MagicMesh({
  //           segments: [32, 32],
  //           vertexShader,
  //           fragmentShader,
  //           elem: startEl,
  //           transition: {
  //             targetElem: endEl,
  //             hWave: 3,
  //             rWave: -1,
  //             xStart: 0.4,
  //             xEnd: 9,
  //             yStart: 0.02,
  //             yEnd: -0.58,
  //             xScale: 0.286,
  //             xShift: 0.08,
  //             yScale: 0.487,
  //             yShift: 0.286,
  //             duration: 1.2,
  //             ease: "power3.inOut",
  //           },
  //           uniforms: {
  //             uTexture: { value: videoTexture },
  //             uColor: { value: new THREE.Color("black") },
  //             uProgress: { value: 0 },
  //             uTextureAspect: {
  //               value:
  //                 video.videoWidth && video.videoHeight
  //                   ? video.videoWidth / video.videoHeight
  //                   : 1,
  //             },
  //             uRadius: { value: 20 },
  //             uRadiusEnd: { value: 0 },
  //             Ufade: { value: 0 },
  //             uColorOffset: { value: 1 },
  //           },
  //           useCssTransform: false,
  //         });

  //         // Ensure video plays and set aspect when available
  //         if (video.videoWidth && video.videoHeight) {
  //           reelMesh.material &&
  //             reelMesh.material.uniforms &&
  //             (reelMesh.material.uniforms.uTextureAspect.value =
  //               video.videoWidth / video.videoHeight);
  //         }

  //         // update aspect when loadeddata fires (covers async cases)
  //         try {
  //           const onLoaded = () => {
  //             try {
  //               if (
  //                 video.videoWidth &&
  //                 video.videoHeight &&
  //                 reelMesh.material &&
  //                 reelMesh.material.uniforms
  //               ) {
  //                 reelMesh.material.uniforms.uTextureAspect.value =
  //                   video.videoWidth / video.videoHeight;
  //               }
  //             } catch (e) {}
  //           };
  //           video.addEventListener("loadeddata", onLoaded);
  //           createdListenersRef.current.push({
  //             target: video,
  //             type: "loadeddata",
  //             handler: onLoaded,
  //           });
  //         } catch (e) {
  //           // ignore
  //         }

  //         registerMesh(reelMesh);
  //         reelMeshRef.current = reelMesh;
  //         createdMeshesRef.current.push(reelMesh);
  //         console.log("Loader: registered reel mesh", reelMesh);
          
  //         // DEBUG: Log mesh state after first update
  //         setTimeout(() => {
  //           reelMesh.update();
  //           console.log("Loader: mesh after first update", {
  //             size: { x: reelMesh.size.x, y: reelMesh.size.y },
  //             pos: { x: reelMesh.pos.x, y: reelMesh.pos.y },
  //             elem: reelMesh.elem,
  //             elemDimensions: {
  //               offsetWidth: reelMesh.elem?.offsetWidth,
  //               offsetHeight: reelMesh.elem?.offsetHeight
  //             }
  //           });
  //         }, 100);

          // small visual debug: add a semi-opaque plane so we can confirm rendering if shader fails
          // try {
          //   const debugGeom = new THREE.PlaneGeometry(200, 100);
          //   const debugMat = new THREE.MeshBasicMaterial({
          //     // color: 0xff0000,
          //     transparent: true,
          //     opacity: 0.25,
          //   });
          //   const debugMesh = new THREE.Mesh(debugGeom, debugMat);
          //   // put debug mesh near center
          //   debugMesh.position.set(0, 0, 0);
          //   registerMesh(debugMesh);
          //   createdMeshesRef.current.push(debugMesh);
          //   // remove debug mesh after a few seconds
          //   setTimeout(() => {
          //     try {
          //       unregisterMesh(debugMesh);
          //     } catch (e) {}
          //   }, 3000);
          // } catch (e) {
          //   console.warn("Loader: failed to add debug mesh", e);
          // }

          // animate the loader odometer value to 100 so it looks like loading
          // try {
          //   const odometerEl = document.querySelector(".odometer-value");
          //   if (odometerEl) {
          //     const obj = { n: 0 };
          //     const odometerTween = gsap.to(obj, {
          //       n: 100,
          //       duration: 1.0,
          //       ease: "power2.out",
          //       onUpdate: () => {
          //         odometerEl.textContent = Math.floor(obj.n);
          //       },
          //     });
          //     createdTweensRef.current.push(odometerTween);
          //   }
          // } catch (e) {
          //   console.warn("Loader odometer animation failed", e);
          // }

          // ensure cleanup when unmounting. We'll collect tweens/listeners/meshes into refs
          // const cleanup = () => {
          //   try {
          //     // kill any created tweens
          //     createdTweensRef.current.forEach((t) => {
          //       try {
          //         t.kill && t.kill();
          //       } catch (e) {}
          //     });
          //     createdTweensRef.current = [];
          //   } catch (e) {}
          //   try {
          //     // attempt to kill ScrollTrigger instances created on this page (best-effort)
          //     if (
          //       window &&
          //       window.ScrollTrigger &&
          //       typeof window.ScrollTrigger.getAll === "function"
          //     ) {
          //       try {
          //         window.ScrollTrigger.getAll().forEach(
          //           (st) => st.kill && st.kill()
          //         );
          //       } catch (e) {}
          //     }
          //   } catch (e) {}
          //   try {
          //     // remove any registered meshes
          //     createdMeshesRef.current.forEach((m) => {
          //       try {
          //         unregisterMesh(m);
          //       } catch (e) {}
          //     });
          //     createdMeshesRef.current = [];
          //   } catch (e) {}
          //   try {
          //     video.pause();
          //   } catch (e) {}
          //   try {
          //     // remove any DOM/window listeners we stored (supports video or window targets)
          //     createdListenersRef.current.forEach(
          //       ({ target, type, handler }) => {
          //         try {
          //           target.removeEventListener(type, handler);
          //         } catch (e) {}
          //       }
          //     );
          //     createdListenersRef.current = [];
          //   } catch (e) {}
          //   try {
          //     // Clean up global parchment references
          //     delete window.parchment;
          //     delete window.parchmentMesh;
          //   } catch (e) {}
          // };
          // store cleanup on ref so it can be called if loader unmounts before assetsReady
          // loader._cleanup = cleanup;
          // setAssetsReady(true);
          // Add GSAP hero/scroll animations similar to the original static site.
          // try {
          //   const endReel =
          //     targetRef && targetRef.current
          //       ? targetRef.current
          //       : document.querySelector(".big");

          //   // scroll text
          //   try {
          //     const scrollTextTween = gsap.to(".scroll", {
          //       x: -1000,
          //       opacity: 0,
          //       ease: "power4.inOut",
          //       scrollTrigger: {
          //         trigger: ".reelWrapper",
          //         start: "top top",
          //         end: "center top",
          //         scrub: true,
          //       },
          //     });
          //     createdTweensRef.current.push(scrollTextTween);
          //   } catch (e) {
          //     console.warn("Loader: failed to create scroll text tween", e);
          //   }

          //   // expand small.forText width
          //   try {
          //     const smallForTextTween = gsap.to(".small.forText", {
          //       width: "100vw",
          //       ease: "power4.inOut",
          //       scrollTrigger: {
          //         trigger: ".reelWrapper",
          //         start: "top top",
          //         end: "+=70%",
          //         scrub: true,
          //       },
          //     });
          //     createdTweensRef.current.push(smallForTextTween);
          //   } catch (e) {
          //     console.warn("Loader: failed to create small.forText tween", e);
          //   }

          //   // animate reel mesh progress via scroll
          //   try {
          //     const reelTween = gsap.to(reelMesh, {
          //       progress: 1,
          //       ease: "none",
          //       scrollTrigger: {
          //         trigger: ".reelWrapper",
          //         start: "top top",
          //         end: "+=600%",
          //         scrub: true,
          //       },
          //     });
          //     reelTweenRef.current = reelTween;
          //     createdTweensRef.current.push(reelTween);

          //     // wire global video-play/pause events to pause/resume the reel tween
          //     try {
          //       const onVideoPlay = () => {
          //         try {
          //           reelTween && reelTween.resume && reelTween.resume();
          //         } catch (e) {}
          //       };
          //       const onVideoPause = () => {
          //         try {
          //           reelTween && reelTween.pause && reelTween.pause();
          //         } catch (e) {}
          //       };
          //       window.addEventListener("video-play", onVideoPlay);
          //       window.addEventListener("video-pause", onVideoPause);
          //       createdListenersRef.current.push({
          //         target: window,
          //         type: "video-play",
          //         handler: onVideoPlay,
          //       });
          //       createdListenersRef.current.push({
          //         target: window,
          //         type: "video-pause",
          //         handler: onVideoPause,
          //       });
          //     } catch (e) {
          //       // ignore listener wiring errors
          //     }
          //   } catch (e) {
          //     console.warn("Loader: failed to create reel tween", e);
          //   }

          //   try {
          //     const heroShift = gsap.to(".hero", {
          //       position: "relative",
          //       top: 500,
          //       ease: "none",
          //       scrollTrigger: {
          //         trigger: ".moto",
          //         start: "top 100%",
          //         end: "top top",
          //         scrub: true,
          //       },
          //       onUpdate: function () {
          //         if (endReel) endReel.style.opacity = this.progress();
          //       },
          //     });
          //     createdTweensRef.current.push(heroShift);
          //   } catch (e) {
          //     console.warn("Loader: failed to create hero shift tween", e);
          //   }

          //   // Moto text animation (updates reel uniform and small UI opacities)
          //   try {
          //     const isMobile = window.innerWidth <= 768;
          //     const keepScroll = document.querySelector(".moto .keepScroll");
          //     try {
          //       const motoTween = gsap.to(".moto .text .image-subtract", {
          //         scale: isMobile ? 550 : 500,
          //         ease: "power4.inOut",
          //         scrollTrigger: {
          //           trigger: ".moto",
          //           start: "top -100%",
          //           end: "bottom top",
          //           scrub: true,
          //         },
          //         onUpdate: function () {
          //           try {
          //             const progress = this.progress();
          //             const mesh = reelMeshRef.current;
          //             if (
          //               mesh &&
          //               mesh.material &&
          //               mesh.material.uniforms &&
          //               typeof mesh.material.uniforms.Ufade !== "undefined"
          //             ) {
          //               mesh.material.uniforms.Ufade.value = progress * 4;
          //             }
          //             if (keepScroll)
          //               keepScroll.style.opacity = `${Math.max(
          //                 0,
          //                 0.3 - progress * 7
          //               )}`;
          //             if (endReel)
          //               endReel.style.opacity = `${Math.max(
          //                 0,
          //                 1 - progress * 7
          //               )}`;
          //           } catch (uErr) {
          //             // ignore per-frame uniform update errors
          //           }
          //         },
          //       });
          //       createdTweensRef.current.push(motoTween);
          //     } catch (uErr) {
          //       console.warn("Loader: failed to setup moto tween", uErr);
          //     }
          //   } catch (mErr) {
          //     console.warn("Loader: failed to setup moto GSAP animation", mErr);
          //   }
          // } catch (e) {
          //   console.warn("Loader: failed to setup hero GSAP animations", e);
          // }
          // Create the Manifesto parchment mesh (approximate behavior)
          // try {
          //   // load parchment image as a texture
          //   const parchmentImg = await loader.loadImage(
          //     "/images/textures/parchment.jpg"
          //   );

          //   // create a parchment text texture using the renderer
          //   // Wait for renderer to be available (ThreeScene may mount slightly after Loader)
          //   const waitForRenderer = () =>
          //     new Promise((resolve) => {
          //       if (renderer) return resolve(renderer);
          //       const iv = setInterval(() => {
          //         if (renderer) {
          //           clearInterval(iv);
          //           resolve(renderer);
          //         }
          //       }, 50);
          //       // safety timeout
          //       setTimeout(() => {
          //         clearInterval(iv);
          //         resolve(renderer);
          //       }, 3000);
          //     });

          //   const fullText = `At Sheryians SRC, we believe learning should be raw, hands-on, and driven by curiosity not rote or passive. Skills matter more than degrees, courage matters more than comfort, and knowledge only grows when it is shared. This is not just a classNameroom, it is a movement: a community where builders are born, rebels become creators, and ideas turn into impact. We commit to writing code that matters, challenging the ordinary, lifting each other up, and staying unapologetically curious. We are not waiting for the future we are writing it.`;
          //   const rend = await waitForRenderer();
          //   if (!rend)
          //     throw new Error("Renderer not available for ParchmentTexture");
          //   const parchment = new ParchmentTexture(
          //     rend,
          //     parchmentImg,
          //     fullText,
          //     { width: window.innerWidth, height: window.innerHeight }
          //   );

          //   const parchmentElem = document.querySelector(
          //     ".manifesto .parchment img"
          //   );
          //   if (parchmentElem) {
          //     const vShader = parchmentVertex;
          //     const fShader = parchmentFragment;

          //     const parchmentMesh = new MagicMesh({
          //       elem: parchmentElem,
          //       segments: [32, 32],
          //       uniforms: {
          //         uTexture: { value: parchment.texture },
          //         uTextureBack: { value: parchment.texture },
          //         uTextureAspect: {
          //           value:
          //             parchment.texture.source.data.width /
          //             parchment.texture.source.data.height,
          //         },
          //         uProgress: { value: -0.1 },
          //         uVertical: { value: false },
          //         uReverse: { value: false },
          //         uRadius: { value: 0.1 },
          //         uRolls: { value: 8.0 },
          //         uEdgeRoughness: { value: 0.05 },
          //       },
          //       transparent: true,
          //       vertexShader: vShader,
          //       fragmentShader: fShader,
          //       side: 2,
          //     });

          //     registerMesh(parchmentMesh);
          //     createdMeshesRef.current.push(parchmentMesh);

          //     // Expose parchment globally for homeInit.js resize function
          //     window.parchment = parchment;
          //     window.parchmentMesh = parchmentMesh;

          //     // GSAP scrub control for the parchment (port of static timeline)
          //     try {
          //       const p1 = gsap.to(parchmentMesh.material.uniforms.uProgress, {
          //         value: 1.1,
          //         ease: "power4.inOut",
          //         scrollTrigger: {
          //           trigger: ".manifesto",
          //           start: "top top",
          //           end: "+=800%",
          //           scrub: true,
          //           onEnter: function () {
          //             parchmentMesh.visible = true;
          //           },
          //           onLeave: function () {
          //             parchmentMesh.material.uniforms.uReverse.value = true;
          //           },
          //           onEnterBack: function () {
          //             parchmentMesh.material.uniforms.uReverse.value = false;
          //           },
          //           onLeaveBack: function () {
          //             parchmentMesh.visible = false;
          //           },
          //         },
          //       });
          //       createdTweensRef.current.push(p1);
          //     } catch (e) {
          //       console.warn("Loader: failed to create parchment tween p1", e);
          //     }

          //     try {
          //       const p2 = gsap.fromTo(
          //         parchmentMesh.material.uniforms.uProgress,
          //         { value: 1.1 },
          //         {
          //           value: -0.1,
          //           ease: "power4.inOut",
          //           scrollTrigger: {
          //             trigger: ".manifesto",
          //             start: "top+=60% top",
          //             end: "bottom-=1% bottom",
          //             scrub: true,
          //             onLeave: function () {
          //               parchmentMesh.visible = false;
          //             },
          //             onEnterBack: function () {
          //               parchmentMesh.visible = true;
          //             },
          //           },
          //         }
          //       );
          //       createdTweensRef.current.push(p2);
          //     } catch (e) {
          //       console.warn("Loader: failed to create parchment tween p2", e);
          //     }
          //   }
          // } catch (pErr) {
          //   console.warn("Loader: failed to create parchment mesh", pErr);
          // }
      //   } catch (err) {
      //     console.error("Error initializing reel mesh:", err);
      //     setAssetsReady(true);
      //   }
      // })
      // .catch((err) => {
      //   console.error("AssetLoader failed to load video:", err);
      //   setAssetsReady(true);
      // });

    // previously fallback handling remains untouched below
    // (no additional fallback needed here)

  //   return () => {
  //     mounted = false;
  //     if (loader && loader._cleanup) loader._cleanup();
  //   };
  // }, [registerMesh, unregisterMesh]);

  // When assets are ready, animate the loader out then remove from DOM.
  // useEffect(() => {
  //   if (!assetsReady) return;
  //   console.log("Loader: assetsReady triggered, starting fade-out animation");
    
  //   const minVisible = 600; // ms minimum visible to avoid flicker
  //   const elapsed = Date.now() - mountTimeRef.current;
  //   const delay = Math.max(0, minVisible - elapsed);
    
  //   const el = loaderRef.current;
  //   if (!el) {
  //     console.warn("Loader: loaderRef.current is null, cannot animate out");
  //     return;
  //   }

  //   console.log("Loader: adding .loaded class after delay:", delay);
    
  //   // Add the .loaded class which triggers CSS animations
  //   setTimeout(() => {
  //     el.classList.add('loaded');
  //     console.log("Loader: .loaded class added, waiting for CSS animation to complete");
      
  //     // Wait for CSS animation to complete (0.7s animation + 0.2s delay + 0.8s transition + 0.9s delay)
  //     // = approximately 2.6 seconds total, so use 3 seconds to be safe
  //     setTimeout(() => {
  //       console.log("Loader: CSS animation complete, removing from DOM");
  //       setRemoved(true);
  //     }, 2600);
  //   }, delay);
  // }, [assetsReady]);

  // if (removed) return null;

  return (
    <div className="loader" ref={loaderRef}>
      <div className="words-wrapper">
        <div className="words">
          <span className="word">private flex</span>
          <span className="word">invite-only club</span>
          <span className="word">main character vibe</span>
          <span className="word">let’s win hackathons</span>
          <span className="word">catch us in godmode</span>
          <span className="word">they prep for 2nd place</span>
          <span className="word">we touch grass after a win</span>
          <span className="word">open source flex</span>
          <span className="word">git push, no cringe</span>
          <span className="word">doing cool stuff</span>
          <span className="word">low effort, high impact</span>
          <span className="word">we’re new sexy</span>
          <span className="word">private flex</span>
        </div>
      </div>
      <div className="progress-meter odometer odometer-theme-minimal">
        <div className="odometer-inside">
          <span className="odometer-digit">
            <span className="odometer-digit-spacer">8</span>
            <span className="odometer-digit-inner">
              <span className="odometer-ribbon">
                <span className="odometer-ribbon-inner">
                  <span className="odometer-value">0</span>
                </span>
              </span>
            </span>
          </span>
          <span className="odometer-digit">
            <span className="odometer-digit-spacer">8</span>
            <span className="odometer-digit-inner">
              <span className="odometer-ribbon">
                <span className="odometer-ribbon-inner">
                  <span className="odometer-value"></span>
                  <span className="odometer-value">0</span>
                </span>
              </span>
            </span>
          </span>
          <span className="odometer-digit">
            <span className="odometer-digit-spacer">8</span>
            <span className="odometer-digit-inner">
              <span className="odometer-ribbon">
                <span className="odometer-ribbon-inner">
                  <span className="odometer-value"></span>
                  <span className="odometer-value">0</span>
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
