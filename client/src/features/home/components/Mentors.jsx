import React from 'react'

const Mentors = () => {
  return (
    <section id="mentors" className="mentors-scroll">
      <div className="mentors-wrapper">
        <div className="mentors-wrapper-flex">
          <div className="top">
            <div className="heading">Mentors of the club.</div>
            <div className="information">we’ve curated the best mentors of the industry to bring the best experience out
              there.
            </div>
            <div className="meet">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.87793 1.81445V12.5312M6.87793 12.5312L12.2363 7.17285M6.87793 12.5312L1.51953 7.17285"
                  stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="information">meet them</span>
            </div>

          </div>
          <div className="mentors"></div>
          <div className="full-view">
            <div className="wrapper">
              <div className="back">
                <svg width="21" height="14" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.3998 6.99467H1.43945M6.99528 12.5491L1.43945 6.99332L6.99528 1.4375" stroke="white"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Go Back</span>
              </div>
              <div className="title">
                Some Real Heading ®
              </div>
              <div className="info">
                faaltu ki baatein and it’s features, tbh we are also searching for what to write, and we have no idea to
                write
                anything here.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mentors
