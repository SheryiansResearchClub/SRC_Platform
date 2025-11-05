import React from 'react'

const Footer = () => {
  return (
    <footer id="footer">
      <div className="top wavy" />
      <div className="mid">
        <div className="draggable">
          <div className="box cat"><img src="/images/icons/cat.webp" alt="" /></div>
          <div className="box ticket"><img src="/images/icons/ticket.webp" alt="" /></div>
          <div className="box coin"><img src="/images/icons/coin.webp" alt="" /></div>
          <div className="box bag"><img src="/images/icons/bag.webp" alt="" /></div>
        </div>
        <div className="join join-club">Join</div>
      </div>
      <div className="bottom">
        <div className="start">
          <div className="down wavy" />
          <div className="quote">From shipping pixels with purpose to rewriting the rules with code — there's a bit of madness in our method.</div>
        </div>
        <div className="end">
          <a target="_blank" rel="noopener noreferrer" href="https://sheryians.com/">Sheryians</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
