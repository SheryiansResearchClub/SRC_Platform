import React, { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'

const VideoPlayer = () => {
  const iframeRef = useRef(null)
  const playerElRef = useRef(null)
  const playBtnRef = useRef(null)
  const fullVideoElRef = useRef(null)
  const timeLabelRef = useRef(null)
  const muteBtnRef = useRef(null)
  const speedBtnRef = useRef(null)
  const barWrapperRef = useRef(null)
  const progressBarRef = useRef(null)
  const draggerRef = useRef(null)
  const closeBtnRef = useRef(null)

  const [videoPlayer, setVideoPlayer] = useState(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const playerControlsRef = useRef({
    isDragging: false,
    lastPos: 0,
    debounceId: null,
    currentSpeedIndex: 0,
    speedOptions: [1, 1.25, 1.5, 2],
    controlsTimeout: null,
    normalPlaybackRate: 1,
  })

  useEffect(() => {
    if (!iframeRef.current) return

    const player = new Player(iframeRef.current)
    setVideoPlayer(player)

    const controls = playerControlsRef.current

    // Setup play/pause events
    player.on('play', () => {
      setIsVideoPlaying(true)
      if (playBtnRef.current) playBtnRef.current.classList.add('playing')
    })

    player.on('pause', () => {
      setIsVideoPlaying(false)
      if (playBtnRef.current) playBtnRef.current.classList.remove('playing')
    })

    // Update time display
    player.on('timeupdate', (data) => {
      if (!controls.isDragging && timeLabelRef.current && progressBarRef.current && draggerRef.current) {
        const progress = (data.seconds / data.duration) * 100
        progressBarRef.current.style.width = `${progress}%`
        draggerRef.current.style.left = `${progress}%`

        const formatTime = (seconds) => {
          const m = Math.floor(seconds / 60)
          const s = Math.floor(seconds % 60).toString().padStart(2, '0')
          return `${m}:${s}`
        }
        timeLabelRef.current.textContent = formatTime(data.seconds)
      }
    })

    player.on('ended', () => {
      setIsVideoPlaying(false)
      if (playBtnRef.current) playBtnRef.current.classList.remove('playing')
      // Optionally close video
      // controls.close()
    })

    return () => {
      try {
        player.off('play')
        player.off('pause')
        player.off('timeupdate')
        player.off('ended')
      } catch (e) {}
    }
  }, [])

  // Define player controls
  const setupControls = (player) => {
    if (!player) return

    const controls = playerControlsRef.current

    controls.play = () => {
      if (isVideoPlaying) {
        player.pause()
      } else {
        player.play()
      }
      controls.startHideControlsTimer()
    }

    controls.mute = () => {
      player.getVolume().then((v) => {
        const next = v > 0 ? 0 : 1
        player.setVolume(next).catch(() => {
          // If setVolume fails, try alternative approach
          console.warn('setVolume not available, trying mute/unmute')
        })
        if (muteBtnRef.current) {
          muteBtnRef.current.textContent = next > 0 ? 'MUTE' : 'UNMUTE'
        }
      }).catch(() => {
        console.warn('getVolume not available on Vimeo player')
        if (muteBtnRef.current) {
          muteBtnRef.current.textContent = 'AUDIO'
        }
      })
    }

    controls.cycleSpeed = () => {
      controls.currentSpeedIndex = (controls.currentSpeedIndex + 1) % controls.speedOptions.length
      const newSpeed = controls.speedOptions[controls.currentSpeedIndex]
      player.setPlaybackRate(newSpeed)
      if (speedBtnRef.current) speedBtnRef.current.textContent = `${newSpeed}x`
      controls.startHideControlsTimer()
    }

    controls.open = () => {
      if (playerElRef.current) {
        playerElRef.current.classList.remove('hidden')
      }
      setIsVideoOpen(true)
      controls.currentSpeedIndex = 0
      player.setPlaybackRate(controls.speedOptions[controls.currentSpeedIndex])
      player.play()
      controls.startHideControlsTimer()
      if (speedBtnRef.current) {
        speedBtnRef.current.textContent = `${controls.speedOptions[controls.currentSpeedIndex]}x`
      }
    }

    controls.close = () => {
      setIsVideoOpen(false)
      if (playerElRef.current) {
        playerElRef.current.classList.add('hidden')
      }
      player.pause()
      controls.clearHideControlsTimer()
    }

    controls.startHideControlsTimer = () => {
      if (!isVideoOpen) return
      controls.clearHideControlsTimer()
      controls.controlsTimeout = setTimeout(() => {
        if (playerElRef.current) playerElRef.current.classList.add('controls-hidden')
      }, 2000)
    }

    controls.clearHideControlsTimer = () => {
      if (controls.controlsTimeout) {
        clearTimeout(controls.controlsTimeout)
        controls.controlsTimeout = null
      }
      if (playerElRef.current) playerElRef.current.classList.remove('controls-hidden')
    }

    controls.updateUI = (pos) => {
      const pct = pos * 100 + '%'
      if (progressBarRef.current) progressBarRef.current.style.width = pct
      if (draggerRef.current) draggerRef.current.style.left = pct
    }

    controls.seek = (pos) => {
      controls.updateUI(pos)
      clearTimeout(controls.debounceId)
      controls.debounceId = setTimeout(async () => {
        const d = await player.getDuration()
        player.setCurrentTime(pos * d)
      }, 50)
    }

    controls.seekClick = (e) => {
      if (!barWrapperRef.current) return
      const { left, width } = barWrapperRef.current.getBoundingClientRect()
      const pos = Math.min(1, Math.max(0, (e.clientX - left) / width))
      controls.seek(pos)
    }

    controls.startDrag = (e) => {
      e.preventDefault()
      controls.isDragging = true
      document.body.style.userSelect = 'none'
      controls.onDrag(e)
    }

    controls.onDrag = (e) => {
      if (!controls.isDragging || !barWrapperRef.current) return
      const { left, width } = barWrapperRef.current.getBoundingClientRect()
      const x = e.touches?.[0]?.clientX ?? e.clientX
      const pos = Math.min(1, Math.max(0, (x - left) / width))
      controls.lastPos = pos
      controls.seek(pos)
    }

    controls.endDrag = () => {
      if (!controls.isDragging) return
      controls.isDragging = false
      document.body.style.userSelect = ''
      clearTimeout(controls.debounceId)
      controls.seek(controls.lastPos)
    }
  }

  useEffect(() => {
    if (!videoPlayer) return
    setupControls(videoPlayer)
  }, [videoPlayer, isVideoPlaying, isVideoOpen])

  // Attach event listeners
  useEffect(() => {
    const controls = playerControlsRef.current

    if (playBtnRef.current) {
      playBtnRef.current.addEventListener('click', () => controls.play?.())
    }

    if (muteBtnRef.current) {
      muteBtnRef.current.addEventListener('click', () => controls.mute?.())
    }

    if (speedBtnRef.current) {
      speedBtnRef.current.addEventListener('click', () => controls.cycleSpeed?.())
    }

    if (barWrapperRef.current) {
      barWrapperRef.current.addEventListener('click', (e) => controls.seekClick?.(e))
    }

    if (draggerRef.current) {
      draggerRef.current.addEventListener('mousedown', (e) => controls.startDrag?.(e))
      draggerRef.current.addEventListener('touchstart', (e) => controls.startDrag?.(e), { passive: false })
    }

    if (closeBtnRef.current) {
      closeBtnRef.current.addEventListener('click', () => controls.close?.())
    }

    window.addEventListener('mousemove', (e) => controls.onDrag?.(e))
    window.addEventListener('touchmove', (e) => controls.onDrag?.(e), { passive: false })
    window.addEventListener('mouseup', () => controls.endDrag?.())
    window.addEventListener('touchend', () => controls.endDrag?.())

    window.addEventListener('keydown', async (e) => {
      if (!isVideoOpen) return
      if (e.code === 'Escape') controls.close?.()
      if (e.code === 'Space') {
        e.preventDefault()
        controls.play?.()
      }
      if (e.code === 'ArrowRight' && videoPlayer) {
        const t = await videoPlayer.getCurrentTime()
        const d = await videoPlayer.getDuration()
        controls.seek?.( Math.min(1, (t + 5) / d))
      }
      if (e.code === 'ArrowLeft' && videoPlayer) {
        const t = await videoPlayer.getCurrentTime()
        const d = await videoPlayer.getDuration()
        controls.seek?.(Math.max(0, (t - 5) / d))
      }
    })

    return () => {
      // Cleanup listeners
      if (playBtnRef.current) playBtnRef.current.removeEventListener('click', () => {})
      if (muteBtnRef.current) muteBtnRef.current.removeEventListener('click', () => {})
      if (speedBtnRef.current) speedBtnRef.current.removeEventListener('click', () => {})
      window.removeEventListener('mousemove', () => {})
      window.removeEventListener('touchmove', () => {})
      window.removeEventListener('mouseup', () => {})
      window.removeEventListener('touchend', () => {})
      window.removeEventListener('keydown', () => {})
    }
  }, [videoPlayer, isVideoOpen])

  return (
    <div className="videoPlayer hidden" ref={playerElRef}>
      <div className="fullvideo" data-full-video data-big-cursor ref={fullVideoElRef}>
        <iframe
          ref={iframeRef}
          title="Sheryians Research Club"
          id="vimeo-player"
          className="vimeo-iframe"
          src="https://player.vimeo.com/video/1083114121?h=76d8f8e72f&title=0&byline=0&portrait=0&controls=0&badge=0&autopause=0&transparent=0&muted=false"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        />
      </div>

      <div data-mouse-extra-mini className="play-btn" ref={playBtnRef}>
        <svg className="play" width="15" height="16" viewBox="0 0 15 16" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.826172 0.210605C0.826172 0.0587001 0.988847 -0.0377543 1.12213 0.0351261L14.5053 7.35333C14.644 7.42919 14.644 7.62843 14.5053 7.70429L1.12213 15.0225C0.988848 15.0954 0.826172 14.9989 0.826172 14.847V0.210605Z" />
        </svg>
        <svg className="pause" width="14" height="15" viewBox="0 0 14 15" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.30379 0.0773926H0.309375C0.198918 0.0773926 0.109375 0.166936 0.109375 0.277393V14.7802C0.109375 14.8907 0.198918 14.9802 0.309375 14.9802H5.30379C5.41424 14.9802 5.50379 14.8907 5.50379 14.7802V0.277393C5.50379 0.166936 5.41424 0.0773926 5.30379 0.0773926Z" />
          <path d="M13.5714 0.0773926H8.57695C8.4665 0.0773926 8.37695 0.166936 8.37695 0.277393V14.7802C8.37695 14.8907 8.4665 14.9802 8.57695 14.9802H13.5714C13.6818 14.9802 13.7714 14.8907 13.7714 14.7802V0.277393C13.7714 0.166936 13.6818 0.0773926 13.5714 0.0773926Z" />
        </svg>
      </div>

      <div data-mouse-extra-mini className="bottom">
        <div data-mouse-extra-mini className="mute textBtn" ref={muteBtnRef}>mute</div>
        <div data-mouse-extra-mini className="progress" ref={barWrapperRef}>
          <div data-mouse-extra-mini className="bar" ref={progressBarRef}>
            <div data-mouse-extra-mini className="dragger" ref={draggerRef} />
          </div>
        </div>
        <div className="right-btns textBtn">
          <div data-mouse-extra-mini className="time" ref={timeLabelRef}>0:00</div>
          <div data-mouse-extra-mini className="speed" ref={speedBtnRef}>1x</div>
        </div>
      </div>

      <div data-mouse-extra-mini className="close-btn ishidden" ref={closeBtnRef}>
        <svg data-mouse-extra-mini className="close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27 27L13.928 14L27 1M1 1L14.072 14L1 27" stroke="#FFFFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default VideoPlayer
