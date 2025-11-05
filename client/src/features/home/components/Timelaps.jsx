import React, { useEffect, useRef } from 'react'
import ImageSequenceViewer from '../../../libs/ImageSequenceViewer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Ensure ScrollTrigger is registered before creating any ScrollTrigger animations.
gsap.registerPlugin(ScrollTrigger)

const Timelaps = () => {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const container = wrapperRef.current || document.querySelector('.video-wrapper')
    if (!container) return

    const config = {
      container,
      frames: 28,
      currentFrame: 1,
      folderPath: '/videos/timelapse',
      ext: 'webp',
    }

    const viewer = new ImageSequenceViewer({
      folderPath: config.folderPath,
      ext: config.ext,
      count: config.frames,
      container: config.container,
      useCanvas: true,
    })

    viewer.setFrame(config.currentFrame)

    const tween = gsap.to(config, {
      currentFrame: config.frames,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timelaps',
        start: 'top top',
        end: '+=350%',
        scrub: true,
        onUpdate: function (self) {
          const frame = 1 + Math.floor(self.progress * config.frames)
          viewer.setFrame(frame)
        },
        onLeave: () => { document.body.classList.add('clipped') },
        onEnterBack: () => { document.body.classList.remove('clipped') },
      }
    })

    return () => {
      try { tween.kill && tween.kill() } catch (e) {}
    }
  }, [])

  return (
    <section id="timelaps" className="timelaps">
      <div className="video-wrapper" ref={wrapperRef} />
      <div className="join-wrapper">
        <div className="gradient-bg" />
        <div className="container">
          <div className="heading">Why join us?</div>
          <div className="information">Join SRC to build real tools, not just follow tutorials. Work with smart, driven minds and turn ideas into actual impact. This is where real builders belong.</div>
          <div className="joinbtn join-club">Join the Club</div>
        </div>
      </div>
    </section>
  )
}

export default Timelaps
