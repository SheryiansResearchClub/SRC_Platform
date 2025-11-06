import React, { useState, useEffect } from 'react'
import '../styles/ApplicationForm.css'

const ApplicationForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [preflightConfirmed, setPreflightConfirmed] = useState(false)
  const [formData, setFormData] = useState({
    // Section 1: Preflight
    preflightConfirm: false,
    // Section 2: Basic Information
    fullname: '',
    email: '',
    phone: '',
    city: '',
    phase: '',
    howhear: '',
    // Section 3: Proof of Existence
    worklinks: '',
    primary: '',
    strongSuit: '',
    skilllevel: '',
    years: '',
    artifact: null,
    defineProject: '',
    complex: '',
    // Section 4: Mental Profile
    learn: '',
    research: '',
    drive: '',
    weakness: '',
    // Section 5: Life Story & Vision
    lifeStory: '',
    xFactor: '',
    dreamProject: '',
    otherRoles: '',
    // Section 6: Video Submission
    videoLink: '',
    videoNote: '',
    // Section 7: Ethics & Perspective
    privateTest: '',
    compete: '',
    hate: '',
    inspire: '',
    // Section 8: Technical Snapshot
    languages: '',
    stack: '',
    tools: '',
    concept: '',
    mustSee: '',
    // Section 9: Non-Negotiable Rules
    rulesConfirm: false
  })

  const TOTAL_STEPS = 9

  // Hook to .join-club buttons globally
  useEffect(() => {
    const handleClick = (e) => {
      e.preventDefault()
      setIsOpen(true)
      setStep(0)
    }
    const buttons = document.querySelectorAll('.join-club')
    buttons.forEach(btn => btn.addEventListener('click', handleClick))
    return () => buttons.forEach(btn => btn.removeEventListener('click', handleClick))
  }, [])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  // Manage body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.top = `-${scrollY}px`
      document.body.classList.add('modal-open')
      document.documentElement.classList.add('modal-open')
    } else {
      // Restore scroll position
      const scrollY = parseInt(document.body.style.top || '0') * -1
      document.body.classList.remove('modal-open')
      document.documentElement.classList.remove('modal-open')
      document.body.style.top = ''
      window.scrollTo(0, scrollY)
    }
    return () => {
      document.body.classList.remove('modal-open')
      document.documentElement.classList.remove('modal-open')
      document.body.style.top = ''
    }
  }, [isOpen])

  // Prevent touch scrolling on modal overlay but allow inside form
  useEffect(() => {
    if (!isOpen) return

    const handleTouchMove = (e) => {
      const formContent = document.getElementById('formContent')
      // Only prevent touch if NOT on form content
      if (!formContent || !formContent.contains(e.target)) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setFormData(p => ({ ...p, [name]: checked }))
      if (name === 'preflightConfirm') {
        setPreflightConfirmed(checked)
      }
    } else if (type === 'file') {
      setFormData(p => ({ ...p, [name]: files[0] }))
    } else {
      setFormData(p => ({ ...p, [name]: value }))
    }
  }

  const handleNext = () => {
    if (step === 0 && !preflightConfirmed) {
      alert('Please confirm the preflight checklist to proceed')
      return
    }
    setStep(p => Math.min(TOTAL_STEPS - 1, p + 1))
  }

  const handlePrev = () => setStep(p => Math.max(0, p - 1))

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setFormData({
        preflightConfirm: false, fullname: '', email: '', phone: '', city: '', phase: '', howhear: '',
        worklinks: '', primary: '', strongSuit: '', skilllevel: '', years: '', artifact: null,
        defineProject: '', complex: '', learn: '', research: '', drive: '', weakness: '',
        lifeStory: '', xFactor: '', dreamProject: '', otherRoles: '', videoLink: '', videoNote: '',
        privateTest: '', compete: '', hate: '', inspire: '', languages: '', stack: '', tools: '',
        concept: '', mustSee: '', rulesConfirm: false
      })
      setStep(0)
      setPreflightConfirmed(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          fd.append(key, value)
        }
      })
      
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: fd
      })
      if (res.ok) {
        alert('Application submitted successfully!')
        setIsOpen(false)
        setFormData({
          preflightConfirm: false, fullname: '', email: '', phone: '', city: '', phase: '', howhear: '',
          worklinks: '', primary: '', strongSuit: '', skilllevel: '', years: '', artifact: null,
          defineProject: '', complex: '', learn: '', research: '', drive: '', weakness: '',
          lifeStory: '', xFactor: '', dreamProject: '', otherRoles: '', videoLink: '', videoNote: '',
          privateTest: '', compete: '', hate: '', inspire: '', languages: '', stack: '', tools: '',
          concept: '', mustSee: '', rulesConfirm: false
        })
        setStep(0)
        setPreflightConfirmed(false)
      } else {
        alert('Error submitting. Please try again.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Error submitting. Please try again.')
    }
  }

  return (
    <div className={`src-modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
      <div className="src-modal-surface">
        <header>
          <div className="header-left">
            <button type="button" className="close-modal-btn" onClick={() => setIsOpen(false)}>✕</button>
            <h1>SRC Entry Form</h1>
          </div>
          <div className="progress-dots">
            {[...Array(TOTAL_STEPS)].map((_, i) => (
              <div key={i} className={`progress-dots__item ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`} />
            ))}
          </div>
        </header>

        <div className="src-modal-body">
          <form id="srcForm" onSubmit={handleSubmit}>
            <div id="formContent">
              
              {/* SECTION 0: Preflight */}
              <div className={`section ${step === 0 ? 'active' : ''}`}>
                  <div className="">
                    <div className="preflight">
                      <h3>⚠️ DO NOT WASTE OUR TIME</h3>
                      <p>If you submit false, AI-generated, or fabricated work your application will be instantly discarded and you will be permanently blacklisted from SRC.</p>
                      <p>All submissions are reviewed manually by our team, no automated scoring or AI flagging is used. We perform human audits, repository inspections, and live verification demos when necessary.</p>
                      <p>We never publish applicants' private files, personal data, or identities. Confirmed fraud is handled internally and affected applicants will be notified.</p>
                      <p><strong>Be original. Be verifiable. Be ready for verification.</strong></p>
                    </div>
                    <h2 className="section-title">Preflight, Confirm & Proceed</h2>
                    <p className="microcopy">Read the enforcement points carefully. Proceed only if everything you submit is original and verifiable.</p>
                  </div>
                  <div className="confirmation-box">
                    <label>
                      <input type="checkbox" id="preflightConfirm" name="preflightConfirm" checked={preflightConfirmed} onChange={handleChange} />
                      <span>I confirm I have read the rules and will submit only original, demonstrable work. <strong>(Required)</strong></span>
                    </label>
                    <div className="microcopy">Uploads are manually reviewed, fraudulent artifacts will disqualify you. Shortlisted applicants must complete a mandatory live verification demo.</div>
                  </div>
                </div>

              {/* SECTION 1: Basic Information */}
              <div className={`section ${step === 1 ? 'active' : ''}`}>
                  <h2 className="section-title">Basic Information</h2>
                  <div className="grid">
                    <div className="form-group">
                      <label htmlFor="fullname">Full Name <span className="required-star">*</span></label>
                      <input id="fullname" name="fullname" type="text" placeholder="Aayush Chouhan" value={formData.fullname} onChange={handleChange} required />
                      <div className="microcopy">Real names only. No aliases.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email <span className="required-star">*</span></label>
                      <input id="email" name="email" type="email" placeholder="you@domain.com" value={formData.email} onChange={handleChange} required />
                      <div className="microcopy">We will use this only for one-time contact.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">WhatsApp Number <span className="required-star">*</span></label>
                      <input id="phone" name="phone" type="tel" inputMode="tel" placeholder="e.g. +919987XXXXXX" value={formData.phone} onChange={handleChange} required />
                      <div className="microcopy">Used for urgent verification. Use your main number.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City, Country <span className="required-star">*</span></label>
                      <input id="city" name="city" type="text" placeholder="Bhopal, India" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phase">Current Phase in Life <span className="required-star">*</span></label>
                      <select id="phase" name="phase" value={formData.phase} onChange={handleChange} required>
                        <option value="">-- select --</option>
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="dropout">Dropout</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="microcopy">Choose the one that best fits you.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="howhear">How did you hear about SRC?</label>
                      <input id="howhear" name="howhear" type="text" placeholder="Member reference / Sheryians / Direct Invite / Event / Other" value={formData.howhear} onChange={handleChange} />
                      <div className="microcopy">Reference name helps, include if you have one.</div>
                    </div>
                  </div>
                </div>

              {/* SECTION 2: Proof of Existence */}
              <div className={`section ${step === 2 ? 'active' : ''}`}>
                  <h2 className="section-title">Proof of Existence</h2>
                  <div className="form-group full">
                    <label htmlFor="worklinks">Top 5 Projects, Links + Impact Statement <span className="required-star">*</span></label>
                    <textarea id="worklinks" name="worklinks" rows="6" placeholder="https://github.com/project-alpha - shipped realtime ops dashboard&#10;https://project.live/demo - cut onboarding time by 40%&#10;https://youtu.be/demo - proved concept to paying users" value={formData.worklinks} onChange={handleChange} required />
                    <div className="microcopy">🔗 Drop 3-5 public links with quick impact notes (20+ words total). We verify everything, broken/private links = instant fail.</div>
                  </div>
                  <div className="grid">
                    <div className="form-group">
                      <label htmlFor="primary">Primary Domain(s) <span className="required-star">*</span></label>
                      <select id="primary" name="primary" value={formData.primary} onChange={handleChange} required>
                        <option value="">-- select primary domain --</option>
                        <option value="ai">AI / ML</option>
                        <option value="security">Cybersecurity</option>
                        <option value="gamedev">Game Development</option>
                        <option value="web">Web / Full Stack</option>
                        <option value="iot">Hardware / IoT</option>
                        <option value="devops">DevOps / Infra</option>
                        <option value="creative">Creative Tech / 3D</option>
                        <option value="cinematics">Cinematics / Editing</option>
                        <option value="product">Product Thinking / Design</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="microcopy">Choose what defines your craft.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="strongSuit">Strong Suit, What you excel at <span className="required-star">*</span></label>
                      <input id="strongSuit" name="strongSuit" type="text" placeholder="e.g. Systems design, exploit dev, shader programming" value={formData.strongSuit} onChange={handleChange} required />
                      <div className="microcopy">Be specific. Provide evidence in projects above.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="skilllevel">Skill Level (1–10) <span className="required-star">*</span></label>
                      <input id="skilllevel" name="skilllevel" type="number" min="1" max="10" placeholder="7" value={formData.skilllevel} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="years">How long have you been building seriously? <span className="required-star">*</span></label>
                      <input id="years" name="years" type="text" placeholder="e.g. 3 years, 5 years of production-grade building" value={formData.years} onChange={handleChange} required />
                    </div>
                    <div className="form-group full">
                      <label htmlFor="artifact">Upload your strongest artifact (optional but telling)</label>
                      <input id="artifact" name="artifact" type="file" accept=".zip,.pdf,.mp4,.mov,.rar,.tar" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group full">
                    <label htmlFor="defineProject">One project that defines your technical identity <span className="required-star">*</span></label>
                    <textarea id="defineProject" name="defineProject" placeholder="Describe the project: vision, hardest challenge, outcome, and what you owned..." value={formData.defineProject} onChange={handleChange} required />
                    <div className="microcopy">Write at least 80 words. Be clear, show impact, and focus on your role.</div>
                  </div>
                  <div className="form-group full">
                    <label htmlFor="complex">What's the most complex or insane thing you've built, broken, or fixed?</label>
                    <textarea id="complex" name="complex" placeholder="Explain why it mattered and the scars you took..." rows="4" value={formData.complex} onChange={handleChange} />
                    <div className="microcopy">We prefer scars over awards.</div>
                  </div>
                </div>

              {/* SECTION 3: Mental Profile */}
              <div className={`section ${step === 3 ? 'active' : ''}`}>
                  <h2 className="section-title">Mental Profile</h2>
                  <div className="grid">
                    <div className="form-group full">
                      <label htmlFor="learn">How do you learn and solve problems when you're stuck?</label>
                      <textarea id="learn" name="learn" rows="5" placeholder="Describe your process: How do you tackle something completely unknown? What do you do when you hit a wall? Include a specific recent example where you felt out of your depth." value={formData.learn} onChange={handleChange} />
                      <div className="microcopy">Be specific, we want your actual process, not theory.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="research">What does "research" mean to you?</label>
                      <textarea id="research" name="research" rows="4" placeholder="Short, real answer, not textbook." value={formData.research} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="drive">What drives you to create when no one is watching?</label>
                      <textarea id="drive" name="drive" rows="4" placeholder="What keeps you building?" value={formData.drive} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="weakness">Biggest current weakness (technical or mental)</label>
                      <input id="weakness" name="weakness" type="text" placeholder="Be honest." value={formData.weakness} onChange={handleChange} />
                    </div>
                  </div>
                </div>

              {/* SECTION 4: Life Story & Vision */}
              <div className={`section ${step === 4 ? 'active' : ''}`}>
                  <h2 className="section-title">Life Story & Vision</h2>
                  <div className="form-group full">
                    <label htmlFor="lifeStory">Life Story, domain journey & why SRC should bet on you <span className="required-star">*</span></label>
                    <textarea id="lifeStory" name="lifeStory" rows="8" placeholder="Share your path in your domain, key setbacks, breakthroughs, leadership moments, and why that makes you indispensable at SRC (150+ words)." value={formData.lifeStory} onChange={handleChange} required />
                    <div className="microcopy">Write it like a story: domain obsession, proof you are top of your craft, how you lift teams, and what SRC gains by backing you.</div>
                  </div>
                  <div className="grid">
                    <div className="form-group">
                      <label htmlFor="xFactor">X-Factor, Why you stand out</label>
                      <input id="xFactor" name="xFactor" type="text" placeholder="What makes you different?" value={formData.xFactor} onChange={handleChange} />
                      <div className="microcopy">Say something crisp and believable.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="dreamProject">If given full freedom, what would you build under SRC?</label>
                      <input id="dreamProject" name="dreamProject" type="text" placeholder="Your dream project idea" value={formData.dreamProject} onChange={handleChange} />
                      <div className="microcopy">What would you create with no constraints?</div>
                    </div>
                    <div className="form-group full">
                      <label htmlFor="otherRoles">Other Roles (Instructor, Management, Marketing, etc.)</label>
                      <input id="otherRoles" name="otherRoles" type="text" placeholder="If you'd be better suited as an instructor, manager, etc." value={formData.otherRoles} onChange={handleChange} />
                      <div className="microcopy">If you prefer a non-contributor role, say why.</div>
                    </div>
                  </div>
                </div>

              {/* SECTION 5: Video Submission */}
              <div className={`section ${step === 5 ? 'active' : ''}`}>
                  <h2 className="section-title">Video Submission</h2>
                  <div className="form-group full">
                    <label htmlFor="videoLink">Video Link (YouTube unlisted, Vimeo, or public drive link) <span className="required-star">*</span></label>
                    <input id="videoLink" name="videoLink" type="url" placeholder="https://youtu.be/..." value={formData.videoLink} onChange={handleChange} required />
                    <div className="microcopy">🎥 Video (60–120s) required. No AI voiceovers. Show yourself + your project or workspace.</div>
                  </div>
                  <div className="form-group full">
                    <label htmlFor="videoNote">Video Notes</label>
                    <textarea id="videoNote" name="videoNote" placeholder="What you show in the video: demo, repo, build, workspace, date visible etc." rows="3" value={formData.videoNote} onChange={handleChange} />
                    <div className="microcopy">Broken/private videos = instant fail.</div>
                  </div>
                </div>

              {/* SECTION 6: Ethics & Perspective */}
              <div className={`section ${step === 6 ? 'active' : ''}`}>
                  <h2 className="section-title">Ethics & Perspective</h2>
                  <div className="grid">
                    <div className="form-group full">
                      <label htmlFor="privateTest">You legitimately get access to a sensitive private system. How far do you test it before you stop?</label>
                      <textarea id="privateTest" name="privateTest" rows="4" placeholder="Describe the checks you would run, the safeguards you respect, and the moment you refuse to go further." value={formData.privateTest} onChange={handleChange} />
                      <div className="microcopy">Spell out your ethical line: what testing is fair, what is off-limits, and why.</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="compete">You join SRC and see someone outperform you, what's your move?</label>
                      <textarea id="compete" name="compete" rows="3" value={formData.compete} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="hate">One thing you absolutely hate about modern tech culture</label>
                      <input id="hate" name="hate" type="text" placeholder="Be specific" value={formData.hate} onChange={handleChange} />
                    </div>
                    <div className="form-group full">
                      <label htmlFor="inspire">Who or what inspires your standard?</label>
                      <input id="inspire" name="inspire" type="text" placeholder="Person, company, quote, or idea" value={formData.inspire} onChange={handleChange} />
                    </div>
                  </div>
                </div>

              {/* SECTION 7: Technical Snapshot */}
              <div className={`section ${step === 7 ? 'active' : ''}`}>
                  <h2 className="section-title">Technical Snapshot</h2>
                  <div className="form-group full">
                    <label htmlFor="languages">Languages / Frameworks you use daily</label>
                    <input id="languages" name="languages" type="text" placeholder="e.g. Python, Rust, React, Three.js" value={formData.languages} onChange={handleChange} />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="stack">Favorite tech stack / workflow</label>
                    <input id="stack" name="stack" type="text" placeholder="What fits you and why?" value={formData.stack} onChange={handleChange} />
                    <div className="microcopy">Explain a small one-line reason for the stack choice.</div>
                  </div>
                  <div className="grid">
                    <div className="form-group">
                      <label htmlFor="tools">Tools you can't live without</label>
                      <input id="tools" name="tools" type="text" placeholder="Editors, platforms, hardware" value={formData.tools} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="concept">One tech concept you've mastered that most don't understand</label>
                      <input id="concept" name="concept" type="text" value={formData.concept} onChange={handleChange} />
                    </div>
                    <div className="form-group full">
                      <label htmlFor="mustSee">Must-see repos or demos (direct links)</label>
                      <input id="mustSee" name="mustSee" type="text" placeholder="comma-separated public URLs" value={formData.mustSee} onChange={handleChange} />
                      <div className="microcopy">We will check these first.</div>
                    </div>
                  </div>
                </div>

              {/* SECTION 8: Non-Negotiable Rules */}
              <div className={`section ${step === 8 ? 'active' : ''}`}>
                  <h2 className="section-title">Non-Negotiable Rules</h2>
                  <div className="rules-list">
                    <div className="rule-item">
                      <div className="rule-number">1</div>
                      <div className="rule-text">
                        Learning comes only from contributing and building real projects, not from theory. You must be willing to ship and iterate.
                      </div>
                    </div>
                    <div className="rule-item">
                      <div className="rule-number">2</div>
                      <div className="rule-text">
                        We move fast. Slow builders don't belong here. If you need hand-holding or a roadmap, SRC is not for you.
                      </div>
                    </div>
                    <div className="rule-item">
                      <div className="rule-number">3</div>
                      <div className="rule-text">
                        Ego is the enemy. We respect technical depth, but we value humility more. You will be challenged, questioned, and pushed.
                      </div>
                    </div>
                    <div className="rule-item">
                      <div className="rule-number">4</div>
                      <div className="rule-text">
                        Open source isn't optional. You will contribute, share learnings, and lift the community. Closed-source builders don't belong here.
                      </div>
                    </div>
                    <div className="rule-item">
                      <div className="rule-number">5</div>
                      <div className="rule-text">
                        We don't care about credentials or brand names. We care about what you've built and what you can build next.
                      </div>
                    </div>
                  </div>
                  <div className="confirmation-box">
                    <label>
                      <input type="checkbox" id="rulesConfirm" name="rulesConfirm" checked={formData.rulesConfirm} onChange={handleChange} />
                      <span>I understand and accept all the non-negotiable rules above. <strong>(Required)</strong></span>
                    </label>
                  </div>
                </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button type="button" id="resetBtn" className="formbtn" onClick={handleReset}>Reset Form</button>
              <div className="button-group">
                {step > 0 && <button type="button" id="prevBtn" className="formbtn" onClick={handlePrev}>Previous</button>}
                {step < TOTAL_STEPS - 1 && <button type="button" id="nextBtn" className="formbtn" onClick={handleNext}>Next</button>}
                {step === TOTAL_STEPS - 1 && <button type="submit" id="submitBtn" className="formbtn" disabled={!formData.rulesConfirm}>Submit</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationForm
