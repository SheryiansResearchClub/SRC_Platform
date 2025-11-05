import React from 'react'

const JoinForm = () => {
  return (
    <form className="joinForm" action="">
      <div className="loading">
        <div className="container">
          <div className="block" />
          <div className="block" />
          <div className="block" />
          <div className="block" />
        </div>
      </div>

      <div className="form">
        <div className="form-header">
          <h1>SRC Entry Form</h1>
          <div className="form-progress" />
        </div>

        <div className="form-section" data-lenis-prevent id="section-1">
          <div className="form-content">
            <div className="form-section-inner">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" placeholder="Aayush Chouhan" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="example@gmail.com" required />
              </div>
            </div>
          </div>

          <div className="form-nav">
            <div />
            <button type="button" className="next-btn" data-next="section-2">Next</button>
          </div>
        </div>
        {/* Additional sections omitted for brevity; they'll be migrated as needed */}
        <div className="form-close">×</div>
      </div>
    </form>
  )
}

export default JoinForm
