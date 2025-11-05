import React from 'react'

const Nav = () => {
  return (
    <nav>
      <a className="logo" data-mouse-extra-mini href="/"> <img src="/images/icons/logo.svg" alt="" /> </a>
      <div data-mouse-extra-mini className="btn register join-club"><span data-mouse-extra-mini>Join The Club</span> </div>
      <menu>
        <div data-mouse-extra-mini className="nav-link-wrapper">
          <div data-mouse-extra-mini data-scroll-to="#hero" className="nav-btn"> Home </div>
          <div data-mouse-extra-mini data-scroll-to="#moto" className="nav-btn">Mission</div>
          <div data-mouse-extra-mini data-scroll-to="#carousel" className="nav-btn">Carousel </div>
          <div data-mouse-extra-mini data-scroll-to="#cards" className="nav-btn">Onboarding</div>
          <div data-mouse-extra-mini data-scroll-to="#timelaps" className="nav-btn">Timelaps</div>
          <div data-mouse-extra-mini data-scroll-to="#mentors" className="nav-btn">Mentors </div>
          <div data-mouse-extra-mini data-scroll-to="#open-roles" className="nav-btn">OpenRoles </div>
          <div data-mouse-extra-mini data-scroll-to="#footer" className="nav-btn">Join Club </div>
        </div>
        <div data-mouse-extra-mini className="toggle " id="menuToggle">
          <svg className="icon" viewBox="0 0 32 32">
            <path className="line top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
            <path className="line middle" d="M7 16 27 16" />
          </svg>
        </div>
      </menu>
    </nav>
  )
}

export default Nav
