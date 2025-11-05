import * as THREE from "three";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import Player from "@vimeo/player";


import MagicMesh from "../../libs/MagicMesh";
import ImageSequenceViewer from "../../libs/ImageSequenceViewer";
import MouseFollower from "../../libs/MouseFollower ";
import AssetLoader from "../../libs/AssetLoader";
import TextAnimator from "../../libs/TextAnimator";
import JoinFormHandler from "../../libs/JoinFormHandler";
import { addClass, animate, createElem, formatTime, get, getAll, hasClass, isMobileOrTablet, load, monitorViewportChanges, onClick, onHover, onResize, pixelFov, removeClass, splitNumber, toggleClass, updateRenderer } from "../../libs/Utils";

import wrapEffectVertex from "../../shaders/wrapEffect/vertex.glsl";
import wrapEffectFragment from "../../shaders/wrapEffect/fragment.glsl";
import carouselFragment from "../../shaders/carousel/fragment.glsl";
import carouselVertex from "../../shaders/carousel/vertex.glsl";

import parchmentFragment from "../../shaders/parchment/fragment.glsl";
import parchmentVertex from "../../shaders/parchment/vertex.glsl";

import { AssetsDatabase, CarouselDatabase, MentorDatabase, OpenRolesDatabase } from "../../libs/Database";
import { DraggableContainer } from "../../libs/DraggableContainer";
import ParchmentTexture from "../../libs/ParchmentTexture";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const size = {
  width: innerWidth,
  height: innerHeight
}

let xCardSetter
let initialized = false
let globalLenis = null;

function init({ cache, lenis: providedLenis }) {

  //POINT - Lenis Setup (Lenis is passed from Home.jsx or created here if not provided)
  
  let lenis = providedLenis;
  if (!lenis && !isMobileOrTablet()) {
    lenis = new Lenis({
      touchMultiplier: 0.7,
      wheelMultiplier: 0.8,
    });
  }
  
  globalLenis = lenis;

  ScrollTrigger.normalizeScroll(isMobileOrTablet())

  //POINT - Mouse follower
  const mouse = new THREE.Vector2();
  const mouseFollowerElem = get('.mouseFollower.playReel')
  const mouseFollower = new MouseFollower(mouseFollowerElem, mouse);


  //SECTION Basic Three Setup

  const scene = new THREE.Scene();

  const cameraDistance = 5

  const camera = new THREE.PerspectiveCamera(pixelFov(cameraDistance), size.width / size.height, 1, 5000);
  camera.position.set(0, 0, cameraDistance);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  updateRenderer(renderer);
  
  const canvasContainer = get("#canvas-container");
  if (canvasContainer) {
    canvasContainer.appendChild(renderer.domElement);
  } else {
    console.warn("Canvas container not found, skipping renderer attachment");
    return;
  }

  //!SECTION

  //SECTION Audio setup
  const audio = cache('/audio/bg.mp3');
  audio.loop = true;

  let isAudioPlaying = false;
  const music = get('.music')

  onClick('.music', () => {
    if (isAudioPlaying) {
      audio.pause();
      removeClass(music, 'playing')
    } else {
      audio.play();
      addClass(music, 'playing')
    }
    isAudioPlaying = !isAudioPlaying;
  });


  onClick('.music-options .with', () => {
    audio.play();
    addClass(music, 'playing')
    isAudioPlaying = true;
    addClass('.music-options', 'selected');
  });

  onClick('.music-options .without', () => {
    addClass('.music-options', 'selected');
  });



  //!SECTION

  const heroBtn = get('#hero-btn')


  //SECTION Full Screen Video Player

  let isVideoPlaying = false;
  let isVideoOpen = false;
  let controlsTimeout = null;
  let lastTapTime = 0;
  let lastTapSide = null;
  let holdTimer = null;
  let isHolding = false;
  let normalPlaybackRate = 1;

  const iframeEl = get('.videoPlayer iframe');
  const videoPlayer = new Player(iframeEl);

  const playerEl = get('.videoPlayer');
  const fullVideoEl = get('.videoPlayer .fullvideo');
  const playBtn = get('.videoPlayer .play-btn');
  const time = get('.videoPlayer .time');
  const muteBtn = get('.videoPlayer .mute');
  const speedBtn = get('.videoPlayer .speed');
  const barWrapper = get('.videoPlayer .progress');
  const progressBar = barWrapper.querySelector('.bar');
  const dragger = barWrapper.querySelector('.dragger');
  const closeBtn = get('.videoPlayer .close-btn');

  // Speed control settings
  const speedOptions = [1, 1.25, 1.5, 2];
  let currentSpeedIndex = 0;

  const playerControls = {
    isDragging: false,
    lastPos: 0,
    debounceId: null,

    // Add speed control method
    cycleSpeed() {
      currentSpeedIndex = (currentSpeedIndex + 1) % speedOptions.length;
      const newSpeed = speedOptions[currentSpeedIndex];
      videoPlayer.setPlaybackRate(newSpeed);
      speedBtn.textContent = `${newSpeed}x`;
      this.startHideControlsTimer();
    },

    open() {
      lenis?.stop();
      playerEl.classList.remove('hidden');
      mouseFollowerElem.classList.add('playing');
      isVideoOpen = true;
      // Reset speed to 1x when opening video
      currentSpeedIndex = 0;
      videoPlayer.setPlaybackRate(speedOptions[currentSpeedIndex]);
      videoPlayer.play();
      this.startHideControlsTimer();
      speedBtn.textContent = `${speedOptions[currentSpeedIndex]}x`;
      gsap.to(playerEl, {
        duration: 0.5,
        opacity: 1,
        ease: 'power2.out',
      });
    },

    close() {
      lenis?.start();
      isVideoOpen = false;
      mouseFollowerElem.classList.remove('playing');
      gsap.to(playerEl, {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.out',
        onComplete: () => {
          if (isAudioPlaying) audio.play();
          videoPlayer.pause();
          playerEl.classList.add('hidden');
          this.clearHideControlsTimer();
        }
      });
    },

    startHideControlsTimer() {
      if (!isVideoOpen) return;
      this.clearHideControlsTimer();
      controlsTimeout = setTimeout(() => {
        playerEl.classList.add('controls-hidden');
        mouseFollowerElem.classList.add('controls-hidden');
      }, 2000);
    },

    clearHideControlsTimer() {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
      }
      playerEl.classList.remove('controls-hidden');
      mouseFollowerElem.classList.remove('controls-hidden');
    },

    play() {
      if (isVideoPlaying) {
        videoPlayer.pause();
        mouseFollowerElem.classList.remove('playing');
      } else {
        mouseFollowerElem.classList.add('playing');
        videoPlayer.play();
      }
      this.startHideControlsTimer();
    },

    mute() {
      videoPlayer.getVolume().then(v => {
        const next = v > 0 ? 0 : 1;
        videoPlayer.setVolume(next);
        muteBtn.textContent = next ? 'MUTE' : 'UNMUTE';
      });
    },

    updateUI(pos) {
      const pct = pos * 100 + '%';
      progressBar.style.width = pct;
      dragger.style.left = pct;
    },

    seek(pos) {
      this.updateUI(pos);
      clearTimeout(this.debounceId);
      this.debounceId = setTimeout(async () => {
        const d = await videoPlayer.getDuration();
        videoPlayer.setCurrentTime(pos * d);
      }, 50);
    },

    seekClick(e) {
      const { left, width } = barWrapper.getBoundingClientRect();
      const pos = Math.min(1, Math.max(0, (e.clientX - left) / width));
      this.seek(pos);
    },

    startDrag(e) {
      e.preventDefault();
      this.isDragging = true;
      document.body.style.userSelect = 'none';
      this.onDrag(e);
    },

    onDrag(e) {
      if (!this.isDragging) return;
      const { left, width } = barWrapper.getBoundingClientRect();
      const x = e.touches?.[0]?.clientX ?? e.clientX;
      const pos = Math.min(1, Math.max(0, (x - left) / width));
      this.lastPos = pos;
      this.seek(pos);
    },

    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.body.style.userSelect = '';
      clearTimeout(this.debounceId);
      this.seek(this.lastPos);
    }
  };

  onClick(playBtn, () => playerControls.play());
  onClick(muteBtn, () => playerControls.mute());
  onClick(speedBtn, () => playerControls.cycleSpeed());
  onClick(barWrapper, e => playerControls.seekClick(e));
  onClick(closeBtn, () => playerControls.close());
  onClick(heroBtn, () => { if (isMobileOrTablet()) playerControls.open(); });

  dragger.addEventListener('mousedown', e => playerControls.startDrag(e));
  dragger.addEventListener('touchstart', e => playerControls.startDrag(e), { passive: false });
  window.addEventListener('mousemove', e => playerControls.onDrag(e));
  window.addEventListener('touchmove', e => playerControls.onDrag(e), { passive: false });
  window.addEventListener('mouseup', () => playerControls.endDrag());
  window.addEventListener('touchend', () => playerControls.endDrag());

  videoPlayer.on('play', () => {
    if (isAudioPlaying) audio.pause();
    addClass(playBtn, 'playing')
    isVideoPlaying = true;
  });

  videoPlayer.on('pause', () => {
    if (isAudioPlaying) audio.play();
    removeClass(playBtn, 'playing')
    isVideoPlaying = false;
  });

  videoPlayer.on('timeupdate', data => {
    if (playerControls.isDragging) return;
    const progress = (data.seconds / data.duration) * 100;
    progressBar.style.width = `${progress}%`;

    const current = formatTime(data.seconds);
    time.textContent = `${current}`;
  });

  videoPlayer.on('ended', () => {
    removeClass(playBtn, 'playing')
    isVideoPlaying = false;
    playerControls.close();
  });

  window.addEventListener('keydown', async e => {
    if (!isVideoOpen) return;
    if (e.code === 'Escape') playerControls.close();
    if (e.code === 'Space') {
      e.preventDefault();
      playerControls.play();
    }
    if (e.code === 'ArrowRight') {
      const t = await videoPlayer.getCurrentTime();
      const d = await videoPlayer.getDuration();
      playerControls.seek(Math.min(1, (t + 5) / d));
    }
    if (e.code === 'ArrowLeft') {
      const t = await videoPlayer.getCurrentTime();
      const d = await videoPlayer.getDuration();
      playerControls.seek(Math.max(0, (t - 5) / d));
    }
  });

  fullVideoEl.addEventListener('touchstart', e => {
    const { clientX } = e.touches[0];
    const { width } = playerEl.getBoundingClientRect();
    const side = clientX < width / 2 ? 'left' : 'right';

    const now = Date.now();
    if (lastTapSide === side && now - lastTapTime < 300) {
      if (side === 'left') {
        videoPlayer.getCurrentTime().then(t => {
          videoPlayer.getDuration().then(d => {
            playerControls.seek(Math.max(0, (t - 10) / d));
          });
        });
      } else {
        videoPlayer.getCurrentTime().then(t => {
          videoPlayer.getDuration().then(d => {
            playerControls.seek(Math.min(1, (t + 10) / d));
          });
        });
      }
    }

    lastTapTime = now;
    lastTapSide = side;

    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      if (isVideoPlaying && side === 'right') {
        isHolding = true;
        videoPlayer.getPlaybackRate().then(rate => {
          normalPlaybackRate = rate;
          videoPlayer.setPlaybackRate(2);
        });
      }
    }, 500);
  });

  fullVideoEl.addEventListener('touchend', () => {
    clearTimeout(holdTimer);
    if (isHolding) {
      isHolding = false;
      videoPlayer.setPlaybackRate(speedOptions[currentSpeedIndex]);
    }
  });

  //!SECTION



  //SECTION Reel Wrap Effect

  //SUBSECTION Reel Mesh setup

  const { video, videoTexture } = cache('/videos/showreel.mp4')
  video.play()

  const startReel = get("#small");
  const endReel = get(".big");
  const reelMesh = new MagicMesh({
    elem: startReel,
    segments: [32, 32],
    transition: {
      targetElem: endReel,
      hWave: 3,
      rWave: -1,
      xStart: .4,
      xEnd: 9,
      yStart: .02,
      yEnd: -.58,
      xScale: .286,
      xShift: .08,
      yScale: .487,
      yShift: .286,
    },
    uniforms: {
      uTexture: { value: videoTexture },
      uColor: { value: new THREE.Color("black") },
      uProgress: { value: 0 },
      uTextureAspect: { value: 1 },
      uRadius: { value: 20 },
      uColorOffset: { value: 1 },
      Ufade: { value: 0 },
    },
    targetZ: -.0001,
    useCssTransform: false,
    vertexShader: wrapEffectVertex,
    fragmentShader: wrapEffectFragment,
    transparent: true,
    side: 2,
  });

  video.addEventListener("loadeddata", () => (reelMesh.material.uniforms.uTextureAspect.value = video.videoWidth / video.videoHeight));

  scene.add(reelMesh);

  //!SUBSECTION
  //!SECTION


  //SECTION Manifesto
  const parchmentTexture = cache('/images/textures/parchment.jpg');
  const parchmentElem = get('.manifesto .parchment img');

  const parchment = new ParchmentTexture(
    renderer,
    parchmentTexture,
    "At Sheryians SRC, we believe learning should be raw, hands-on, and driven by curiosity not rote or passive. Skills matter more than degrees, courage matters more than comfort, and knowledge only grows when it is shared. This is not just a classroom, it is a movement: a community where builders are born, rebels become creators, and ideas turn into impact. We commit to writing code that matters, challenging the ordinary, lifting each other up, and staying unapologetically curious. We are not waiting for the future we are writing it.",
    {
      heading: "Manifesto",
      width: innerWidth,
      height: innerHeight
    })

  const parchmentMesh = new MagicMesh({
    elem: parchmentElem,
    segments: [32, 32],
    uniforms: {
      uTexture: { value: parchmentTexture },
      uTextureBack: { value: parchmentTexture },
      uTextureAspect: { value: parchmentTexture.source.data.width / parchmentTexture.source.data.height },
      uProgress: { value: -.1 },
      uVertical: { value: false },
      uReverse: { value: false },
      uRadius: { value: .1 },
      uRolls: { value: 8.0 },
      uEdgeRoughness: { value: 0.05 }  // jaggedness of edge
    },
    transparent: true,
    vertexShader: parchmentVertex,
    fragmentShader: parchmentFragment,
    side: 2,
  });


  async function onParchmentLoad() {
    const parchmentText = parchment.texture;
    parchmentMesh.material.uniforms.uTexture.value = parchmentText
    parchmentMesh.material.uniforms.uTextureAspect.value = parchmentText.source.data.width / parchmentText.source.data.height;
  }

  onParchmentLoad()

  gsap.to({ progress: 0 }, {
    progress: 1,
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top+=25% top",
      end: "bottom-=25% bottom",
      scrub: true,
    },
    onUpdate: function () {
      parchment.update(this.targets()[0].progress)
    }
  })

  parchmentMesh.visible = false;

  scene.add(parchmentMesh);


  //!SECTION


  //SECTION Carousel setup

  const carousel = get(".carousel-circle");
  const numItems = CarouselDatabase.length;
  const carouselItems = [];

  gsap.set('.carousel ', { height: `${(numItems * 100) + 350}svh` });

  function createCarouselItem({ title, image, index }) {
    const elem = createElem("carousel-item", carousel);
    const titleDiv = createElem("title", elem);
    titleDiv.textContent = title;

    const angle = (index / numItems) * Math.PI * 2;

    gsap.set(elem, {
      "--x": `calc(50% + (50% * ${Math.cos(angle)}))`,
      "--y": `calc(50% + (50% * ${Math.sin(angle)}))`,
      rotation: `${(index / numItems) * 360}deg`,
    });

    return elem;
  }

  const createAllCarouselItems = () => {
    const promises = CarouselDatabase.map((item, i) => {
      const elem = createCarouselItem({ ...item, index: i });
      carousel.appendChild(elem);
      carouselItems[i] = { mesh: null, elem };
      return Promise.resolve();
    });
    return Promise.all(promises);
  };

  async function loadCarouselItems(data) {

    await createAllCarouselItems();

    for (const [i, item] of data.entries()) {
      const elem = carouselItems[i].elem;
      try {
        const texture = cache(item.image);

        const mesh = new MagicMesh({
          elem,
          segments: [32, 32],
          uniforms: {
            uTexture: { value: texture },
            uColor: { value: new THREE.Color("black") },
            uTextureAspect: { value: texture.source.data.width / texture.source.data.height },
            uProgress: { value: i == 0 ? (i * 1.5).toFixed(4) : (i * 1.5).toFixed(6) },
            uMouse: { value: new THREE.Vector2(1000) },
            uRadius: { value: 0.6 },
            uStrength: { value: 0.5, },
          },
          vertexShader: carouselVertex,
          fragmentShader: carouselFragment,
          side: 2,
        });

        scene.add(mesh);
        carouselItems[i].mesh = mesh;

      } catch (error) {
        console.error(`Error loading texture for ${item.image}:`, error);
      }
    }
  }

  loadCarouselItems(CarouselDatabase);


  //!SECTION


  //SECTION Mentors Section setup

  const mentors = get(".mentors");
  const mentorsWrapper = get(".mentors-wrapper");
  const mentorsFullView = get(".mentors-wrapper .full-view");
  const mentorTitle = get(".title", mentorsFullView)
  const mentorInfo = get(".info", mentorsFullView)

  const mentorItems = [];

  const createAllMentorItems = () => {
    const promises = MentorDatabase.map((_, i) => {
      const elem = createElem("mentor-item", mentors);
      elem.setAttribute('data-big-cursor', "true");
      mentors.appendChild(elem);
      mentorItems[i] = { mesh: null, elem };
      return Promise.resolve();
    });
    return Promise.all(promises);
  };

  const calculateMentorOffset = elem => {
    const halfWindowWidth = size.width * 0.5;
    const { left, width } = elem.getBoundingClientRect();
    const distanceRatio = ((left + width * 0.5) - halfWindowWidth) / halfWindowWidth;
    gsap.set(elem, {
      y: Math.abs(distanceRatio * 3.5) + 'rem'
    })
  };

  let isMentorDetailsOpen = false
  async function loadMentors(data) {

    await createAllMentorItems();

    for (const [i, item] of data.entries()) {
      const elem = mentorItems[i].elem;
      calculateMentorOffset(elem);
      try {
        const texture = cache(item.image);
        const mesh = new MagicMesh({
          elem,
          segments: [32, 32],
          transition: { targetElem: mentorsFullView },
          uniforms: {
            uTexture: { value: texture },
            uTextureAspect: { value: 1 },
            uElemTransitionProgress: { value: 1 },
            uColor: { value: new THREE.Color("black") },
            uTextureAspect: { value: texture.source.data.width / texture.source.data.height },
            uRadius: { value: 11.6 },
            uColorOffset: { value: .3 },
            Ufade: { value: 0 },
          },
          useCssTransform: false,
          vertexShader: wrapEffectVertex,
          fragmentShader: wrapEffectFragment,
          targetZ: 0.001,
          side: 2,
        });


        scene.add(mesh);

        onClick(elem, () => {
          if (!isMentorDetailsOpen) {


            addClass(mentorsWrapper.parentElement, 'zmax')
            addClass(renderer.domElement.parentElement, 'zmax')

            // lenis?.stop()

            gsap.to('body', {
              "--clip-size": 0,
              "--clip-round": 0,

              ease: "power2",
              duration: .3,
            });

            addClass(mentorsWrapper, "active")
            mentorTitle.innerText = item.title
            mentorInfo.innerText = item.info
            isMentorDetailsOpen = mesh

            gsap.to(mesh, {
              progress: 1,
              ease: "power2",
              duration: 1,
            });
          }
        })

        onHover(elem, () =>
          gsap.to(mesh.material.uniforms.uColorOffset, {
            value: .7,
            duration: 1,
            ease: "power2"
          }), () =>
          gsap.to(mesh.material.uniforms.uColorOffset, {
            value: 0.3,
            duration: 1,
            ease: "power2"
          })
        )

        mentorItems[i].mesh = mesh;

      } catch (error) {
        console.error(`Error loading texture for ${item.image}:`, error);
      }
    }
  }

  onClick(mentorsFullView, () => {
    removeClass(mentorsWrapper.parentElement, 'zmax')
    removeClass(renderer.domElement.parentElement, 'zmax')

    if (isMentorDetailsOpen) {
      // lenis?.start()
      removeClass(mentorsWrapper, "active")
      gsap.to('.clipped', {
        "--clip-size": size.width > 700 ? '1.5rem' : '0.8rem',
        "--clip-round": '1rem',
        ease: "power2",
        duration: .3,
      });
      gsap.to(isMentorDetailsOpen, {
        progress: 0,
        ease: "power2",
        duration: 1,
        onComplete: () => {
          isMentorDetailsOpen = false
        }
      });
    }
  })

  loadMentors(MentorDatabase);

  //!SECTION


  //SECTION Open Roles setup

  function renderRoles(roles) {
    const roleTemplate = ({ title, positions, href = "/" }) => `
      <div data-big-cursor='true' class="role-title c1">
        <span>${title}</span>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.2695 2.13281L8.60937 8.22181L1.94922 2.13281" stroke="black" stroke-width="4"/>
        </svg>
      </div>
      <svg class="c2 role-line" viewBox="0 0 151 3">
         <line y1="1.55762" x1="10%" x2="80%" y2="1.55762" stroke="black" stroke-width="1" stroke-dasharray="2 1" />
      </svg>
      <div class="positions c3"><span>${positions.toString().padStart(3, '0')}</span> </div>
      <div data-role="${title}" class="apply-btn c4 join-club"> <span>Apply Now</span></div>
    `;

    const detailsTemplate = ({ responsibilities, opportunities, should_apply, should_not_apply }) => `
      <div class="details-grid">
          <div>
          <div class="section-title">Who Should Apply</div>
          <ul>${should_apply.map(item => `<li>${item}</li>`).join('')}</ul>
          <br>
              <div class="section-title">Responsibilities</div>
              <ul>${responsibilities.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div>
          <div class="section-title red">Who Should Not Apply</div>
          <ul>${should_not_apply.map(item => `<li>${item}</li>`).join('')}</ul>
          <br>
              <div class="section-title">Opportunities</div>
              <ul>${opportunities.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
      </div>
    `;

    try {
      const rolesGrid = get('.roles-scroll');
      if (rolesGrid) rolesGrid.innerHTML = ""; // Clear previous roles to prevent duplicates
      roles.forEach(role => {
        const roleEl = createElem('role-wrapper', rolesGrid);
        createElem('role-item', roleEl).innerHTML = roleTemplate(role)
        createElem('details', roleEl).innerHTML = detailsTemplate(role)
      });

      const elms = getAll(".open-roles span")
      let animators = Array.from(elms).map(span => {

        const animator = new TextAnimator(span, {
          charDuration: 0.1,
          staticCharDelay: true
        })

        ScrollTrigger.create({
          trigger: span,
          onEnter: () => {
            animator.animate()
          },

        })


        return
      })

      // ScrollTrigger.create({
      //   trigger: '.open-roles',
      //   start: 'top center',
      //   onEnter: () =>
      // });

      onClick(rolesGrid, (event) => {
        // Check if the click is on role-title or any child of role-item
        const roleTitle = event.target.closest('.role-title');
        const roleItem = event.target.closest('.role-item');
        
        if (!roleTitle && !roleItem) return;

        const roleWrapper = event.target.closest('.role-wrapper');
        if (!roleWrapper) return;

        const details = roleWrapper.querySelector('.details');
        if (!details) return;

        // Prevent multiple rapid clicks
        if (details.dataset.animating === 'true') return;
        details.dataset.animating = 'true';

        const isExpanded = details.dataset.expanded === 'true';
        
        if (isExpanded) {
          details.style.height = '0';
          removeClass(roleWrapper, 'expanded')
          setTimeout(() => {
            details.dataset.expanded = 'false';
            details.dataset.animating = 'false';
          }, 300);
        } else {
          details.dataset.expanded = 'true';
          addClass(roleWrapper, 'expanded')
          // Use requestAnimationFrame to ensure height is calculated correctly
          requestAnimationFrame(() => {
            details.style.height = `${details.scrollHeight}px`;
            setTimeout(() => {
              details.dataset.animating = 'false';
            }, 300);
          });
        }

      }, { passive: true })

    } catch (error) {
      console.error('Error rendering roles:', error);
    }
  }

  renderRoles(OpenRolesDatabase);


  //!SECTION

  //SECTION Mouse move event handler

  function setMouseFollowerMode(dataset) {
    if (isMobileOrTablet()) return
    toggleClass(mouseFollowerElem, 'mini', dataset.bigCursor == undefined)
    toggleClass(mouseFollowerElem, 'extra', dataset.mouseExtraMini != undefined)
  }

  function onMouseMove(event) {
    setMouseFollowerMode(event.target.dataset)
    mouse.set(event.clientX, event.clientY);
    carouselItems.forEach(({ mesh, elem }) => {
      const bounds = elem.getBoundingClientRect();
      mesh?.material.uniforms.uMouse.value.set((mouse.x - bounds.left) / bounds.width, (mouse.y - bounds.top) / bounds.height);
    });
  }

  //!SECTION

  //SECTION Resize event handler

  // Initialize card variables early to prevent reference errors in resize()
  let container, cards, xCardSetter, cardXprogress = 0, getSpread, center;

  function resize() {

    size.width = innerWidth;
    size.height = innerHeight;

    const isDesktop = !isMobileOrTablet()

    xCardSetter && xCardSetter.forEach((setter, i) => setter((i - center) * getSpread() * cardXprogress))

    ScrollTrigger.refresh();

    heroBtn.classList.replace(
      isDesktop ? "play-reel" : "join-club",
      isDesktop ? "join-club" : "play-reel"
    );

    camera.fov = pixelFov(cameraDistance);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    parchment.resize(size.width, size.height)
    parchmentMesh.material.uniforms.uTextureAspect.value = parchment.texture.source.data.width / parchment.texture.source.data.height;
    parchmentMesh.material.uniforms.uVertical.value = size.width > 700 ? false : true;

    updateCarouselSize()
    updateRenderer(renderer);

    if (reelMesh && video) reelMesh.material.uniforms.uTextureAspect.value = video.videoWidth / video.videoHeight;
  }

  //!SECTION


  //SECTION Global mouse click event handler

  function onGlobalMouseClick(event) {
    if (!isMobileOrTablet()) {
      if (event.target.dataset.openReel != undefined) playerControls.open()
      if (event.target.dataset.fullVideo != undefined) playerControls.play()
    }
  }
  //!SECTION

  //SECTION Scroll event handler

  function onScroll(e) {
    updateScrollProgress()
    setMouseFollowerMode(document.elementFromPoint(mouse.x, mouse.y)?.dataset || {})
  }

  //!SECTION


  //SECTION Navigation handlers

  const regBtn = get('nav .register');

  function handelNavOpen(e) {
    const navMenu = get('nav menu');
    toggleClass(navMenu, 'active', !hasClass(navMenu, 'active'));
    hasClass(navMenu, 'active') ? addClass(regBtn, 'shrank') : removeClass(regBtn, 'shrank');

  }

  function handelNavBtns(e) {
    const navBtn = e.target.closest('.nav-btn')
    removeClass(navBtn.parentNode.parentNode, 'active')
    removeClass(regBtn, 'shrank')

    gsap.to(window, {
      scrollTo: navBtn.dataset.scrollTo,
      ease: 'power2.inOut',
      duration: 2,
      onStart: () => {
        document.body.style.overflow = 'hidden'
      },
      onComplete: () => {
        document.body.style.overflow = ''
      }
    });
  }

  //!SECTION


  //SECTION Event listeners

  onClick(window, onGlobalMouseClick);
  onClick('menu .toggle', handelNavOpen);
  onClick('menu .nav-link-wrapper', handelNavBtns);
  onResize(resize);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("scroll", onScroll);
  window.addEventListener('mousemove', () => {
    if (isVideoOpen) {
      playerControls.clearHideControlsTimer();
      playerControls.startHideControlsTimer();
    }
  });

  new JoinFormHandler();

  //!SECTION


  //SECTION Animation loop

  const clock = new THREE.Clock();

  animate((time) => {

    if (scrollY < size.height * 7.5 && video.paused) video.play();

    if (!isMobileOrTablet()) {
      lenis?.raf(time)
    }

    const deltaMs = clock.getDelta() * 1000;
    draggableElems.update(deltaMs);

    !isMobileOrTablet() && mouseFollower.update();

    reelMesh?.update();
    parchmentMesh?.update();
    carouselItems.forEach(({ mesh }) => mesh?.update());
    mentorItems.forEach(({ mesh }, i) => mesh?.update())

    renderer.render(scene, camera);
  })


  //!SECTION


  //SECTION GSAP animations

  //SUBSECTION - Hero Gsap Animation

  gsap.to(".scroll", {
    x: -1000,
    opacity: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: ".reelWrapper",
      start: "top top",
      end: "center top",
      scrub: true,
    },
  });

  gsap.to(".small.forText", {
    width: "100vw",
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: ".reelWrapper",
      start: "top top",
      end: "+=70%",
      scrub: true,
    },
  });

  gsap.to(reelMesh, {
    progress: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".reelWrapper",
      start: "top top",
      end: "+=600%",
      scrub: true,
    },
  });


  gsap.to('.hero', {
    position: 'relative',
    top: 500,
    ease: 'none',
    scrollTrigger: {
      trigger: ".moto",
      start: "top 100%",
      end: "top top",
      scrub: true,
    },
    onUpdate: function (e) {
      endReel.style.opacity = this.progress()
    },
  });


  //!SUBSECTION

  //SUBSECTION - Moto Text Gsap Animation

  const keepScroll = get('.moto .keepScroll ')

  gsap.to(".moto .text .image-subtract",
    {
      scale: isMobileOrTablet() ? 550 : 500,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: ".moto",
        start: "top -100%",
        end: "bottom top",
        scrub: true,
      },

      onUpdate: function (e) {
        reelMesh.material.uniforms.Ufade.value = this.progress() * 4
        keepScroll.style.opacity = .3 - this.progress() * 7
        endReel.style.opacity = 1 - this.progress() * 7
      },

    });


  //SUBSECTION Manifesto Gsap Update

  gsap.to(parchmentMesh.material.uniforms.uProgress,
    {
      value: 1.1,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top top",
        end: "+=800%",
        scrub: true,
        onEnter: function (e) {
          parchmentMesh.visible = true
          console.log('enter');
        },
        onLeave: function (e) {
          parchmentMesh.material.uniforms.uReverse.value = true
        },
        onEnterBack: function (e) {
          parchmentMesh.material.uniforms.uReverse.value = false
        },
        onLeaveBack: function (e) {
          parchmentMesh.visible = false
        }
      },
    });

  gsap.fromTo(parchmentMesh.material.uniforms.uProgress, {
    value: 1.1,
  }, {
    value: -.1,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top+=60% top",
      end: "bottom-=1% bottom",
      scrub: true,
      onLeave: function (e) {
        parchmentMesh.visible = false
      },
      onEnterBack: function (e) {
        parchmentMesh.visible = true
      }
    },
  });



  //!SUBSECTION


  //SUBSECTION Carousel Gsap Update

  function customSnap(value) {
    const n = numItems - 1;
    const index = value * n;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const lowerSnap = lowerIndex / n;
    const upperSnap = upperIndex / n;
    const diff = index - lowerIndex;
    const threshold = 0.2;

    if (diff < threshold) return lowerSnap;
    if (diff > 1 - threshold) return upperSnap;
    return diff < 0.5 ? lowerSnap : upperSnap;
  }


   function updateCarouselSize() {
    const temp = size.width > 768 ? "30rem" : "15rem";
    gsap.fromTo(".carousel .carousel-circle ", {
      "--size": '100vh',
    }, {
      "--size": temp,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top top",
        end: "+=200%",
        scrub: true,
      },
    });
  }

  let imagesLoaded = false

  gsap.to(".carousel-circle", {
    rotate: -((numItems - 1) / numItems) * 360,
    ease: "none",
    scrollTrigger: {
      trigger: ".carousel",
      start: "top -100%",
      end: `+=${numItems}00%`,
      scrub: 1,
      snap: {
        snapTo: customSnap,
        duration: 0.3,
        ease: "linear",
      },
    },
    onUpdate: function () {
      for (let i = 0; i < carouselItems.length; i++) {
        if (!carouselItems[i]) continue;
        const { mesh } = carouselItems[i];
        var [activeIndex, progress] = splitNumber(this.progress() * (numItems - 1));
        mesh && (mesh.material.uniforms.uProgress.value = (i - progress - activeIndex) * 1.5);
      }
    },
    onStart: () => {
      if (!imagesLoaded) {
        imagesLoaded = true
        const images = [...Array.from({ length: 28 }, (_, i) => `/videos/timelapse/${i + 1}.webp`),]

        images.forEach((image) => {
          const img = new Image();
          img.src = image;
        });
      }
    }

  });


  gsap.to(".carousel", {
    top: '100%',
    ease: "none",
    scrollTrigger: {
      trigger: ".timelaps",
      start: "top 100%",
      end: `top -200%`,
      scrub: true,
    },
  })


  //!SUBSECTION

  container = get('#cards.cards');
  cards = gsap.utils.toArray('.card');
  const stack = container.querySelector('.cards-wrapper .card-stack');

  xCardSetter = cards.map(card => gsap.quickSetter(card, 'x', 'px'))
  const yCardSetter = gsap.quickTo(cards, 'y', {
    duration: 0.3,
    ease: 'sine.out',
  })

  cardXprogress = 0

  gsap.utils.toArray('.card');
  getSpread = () => size.width / 4.5;
  center = (cards.length - 1) / 2;
  gsap.matchMedia().add("(min-width: 768px)", () => {

    gsap.fromTo(stack, {
      top: '5svh',
      '--y': '0%',

    }, {
      top: '50%',
      '--y': "-50%",
      scrollTrigger: {
        trigger: stack,
        start: 'top 80%',
        end: '+=100%',
        scrub: true,
        ease: 'power4.inOut',
      },
    })

    const cardAnimations = cards.map((card, i) =>
      gsap.to(card, {
        y: '+=20',
        yoyo: true,
        repeat: -1,
        duration: 2,
        delay: i * .5,
        ease: 'sine.inOut',
        paused: true,
      })
    );


    const master = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top -10%',
        end: '+=500%',
        scrub: 1
      }
    });


    master.to(cards, {
      rotationZ: i => (i - center) * 7,
      ease: 'sine.out',
      duration: .3,
    }, 0);


    master.to(cards, {
      rotationY: 12,
      ease: 'power4.inOut',
      duration: .3,

      onUpdate: function () {
        cardXprogress = this.progress()
        xCardSetter.forEach((setter, i) => setter((i - center) * getSpread() * cardXprogress))
      },

      onStart: () => {
        gsap.set(cards, { xPercent: -50 })
        cardAnimations.forEach((anim) => anim.play())
      },

      onReverseComplete: () => {
        cardAnimations.forEach((anim) => anim.restart(true).pause())
        yCardSetter(0)
      },

    }, 0.05);

    master.to(cards, {
      rotationY: 180,
      rotationZ: 0,
      ease: 'elastic.out(1, 0.6)',
      duration: .4,
      stagger: 0.05
    }, .35);

  }).add("(max-width: 768px)", () => {
    cards.map((card, i) =>
      gsap.to(card, {
        rotationY: 180,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: card.parentElement,
          start: '0% 100%',
          end: 'center center',
          scrub: 1,
          // markers: true,
        }
      })
    );

  })

  // Timelapse is now handled by the React Timelaps component
  // No need to initialize it here


  //SUBSECTION  Mentors Gsap Animation


  gsap.to(".mentors", {
    xPercent: -100,
    x: 75,
    ease: "linear",
    scrollTrigger: {
      trigger: ".mentors-wrapper",
      start: "bottom 0%",
      end: "bottom -600%",
      scrub: true,
    },
    onUpdate: function () {
      mentorItems.forEach(({ elem }, i) => calculateMentorOffset(elem));
    },
  })


  //!SUBSECTION


  //SUBSECTION  Footer Gsap Animation


  const draggableElems = new DraggableContainer(".draggable");

  gsap.to("footer", {
    scrollTrigger: {
      trigger: "footer",
      start: "top 10%",
      onLeaveBack: () => {
        removeClass(document.body, 'footer');
        draggableElems.stop();
      },
      onEnter: () => {
        addClass(document.body, 'footer');
        draggableElems.start();
      }
    }
  });

  gsap.fromTo("footer .mid ", {
    "--height": '0%'
  }, {
    "--height": '50%',
    scrollTrigger: {
      trigger: "footer",
      start: "top 60%",
      end: "top 0%",
      scrub: 1,
    }
  });


  //!SUBSECTION

  //!SECTION

  //SECTION Scroll Progress Bar
  const scrollProgress = get('.scrollProgress');
  const scrollBar = scrollProgress.querySelector('.bar');
  let scrollTimeout;

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    scrollBar.style.height = `${scrollPercent}%`;

    scrollProgress.classList.add('active');

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      scrollProgress.classList.remove('active');
    }, 100);
  }

  //!SECTION

}


//SECTION Loading Assets And Initialization

// Initialize viewport change monitoring
monitorViewportChanges();

export function startHome(options = {}) {
  if (initialized) return;
  initialized = true;
  monitorViewportChanges();
  load(() => {
    new AssetLoader(AssetsDatabase).load().then((assets) => {
      init({ ...assets, lenis: options.lenis });
      get('.loader')?.classList.add('loaded');
      setTimeout(() => {
        get('html')?.classList.remove('loading');
        document.body.style.overflow = '';
        setTimeout(() => {
          get('.loader')?.remove();
        }, 1000);
      }, 1500);
    });
  });
}

export default startHome;
