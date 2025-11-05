import React from 'react'

// Accept refs for the small (start) and big (target) reel elements so the
// Loader / MagicMesh can be wired deterministically without DOM polling.
const HeroSection = ({ startRef, targetRef }) => {
  return (
    <section id="hero" className="hero">
      <div className="reelWrapper">
        <div className="text">
          Make it where it matters
        </div>
        <a id="hero-btn" className="btn join-club">
          <svg className="play" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 36 36">
            <path fill="currentColor"
              d="M7 7.29c0-1.5 1.59-2.466 2.92-1.776l20.656 10.71c1.439.747 1.439 2.805 0 3.552L9.92 30.486C8.589 31.176 7 30.21 7 28.71V7.29Z">
            </path>
          </svg>
        </a>

        <div className="reel">
          <div data-big-cursor data-open-reel id="small" className="small" ref={startRef}> </div>

          <div className="small forText">
            <span className="text colored"> Make it where it matters </span>
          </div>

          <div data-big-cursor data-open-reel className="big" ref={targetRef}>
          </div>
        </div>
      </div>
      <div className="scroll">SCROLL DOWN</div>
    </section>

  )
}

export default HeroSection
