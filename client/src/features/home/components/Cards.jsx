import React from 'react'

const Cards = () => {
  return (
    <section id="cards" className="cards">
      <div className="title">
        <div>
          Process to <span>Join Club</span>
        </div>
      </div>
      <div className="cards-wrapper">
        <div className="card-stack">
          {[1,2,3,4].map(i => (
            <div key={i} className="card-container">
              <div className="card">
                <div className="back" />
                <div className="front">
                  <img src={`/images/cards/${i}.webp`} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Cards
