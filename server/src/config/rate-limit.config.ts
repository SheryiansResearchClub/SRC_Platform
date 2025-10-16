export const rateLimitConfig = {
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                 // 1000 requests per 15 minutes
    message: 'Too many requests, please try again later.',
    standardHeaders: true,     // Return rate limit info in headers
    legacyHeaders: false,      // Disable X-RateLimit-* headers
  },

  // Authentication endpoints (per IP)
  auth: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,                    // 5 login attempts per 15 minutes
      message: 'Too many login attempts, please try again after 15 minutes.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,                    // 3 registrations per hour per IP
      message: 'Too many registration attempts, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    forgotPassword: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,                    // 3 forgot password requests per hour
      message: 'Too many password reset requests, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    verifyEmail: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,                    // 5 verification attempts per hour
      message: 'Too many verification attempts, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    refreshToken: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10,                   // 10 refresh attempts per 15 minutes
      message: 'Too many token refresh attempts, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    }
  },

  // Email sending (custom logic, not express-rate-limit)
  email: {
    perUser: {
      hourly: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10,                   // 10 emails per hour per user
      },
      daily: {
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: 50,                        // 50 emails per day per user
      }
    },
    global: {
      hourly: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 500,                  // 500 emails per hour (Gmail limit)
      },
      daily: {
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: 2000,                      // 2000 emails per day
      }
    }
  },

  // API endpoints (per user)
  api: {
    createProject: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,                   // 10 projects per hour
      message: 'Too many projects created, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    createTask: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 50,                   // 50 tasks per hour
      message: 'Too many tasks created, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    uploadFile: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20,                   // 20 file uploads per hour
      message: 'Too many file uploads, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    postComment: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100,                  // 100 comments per hour
      message: 'Too many comments posted, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },
    updateProfile: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,                   // 10 profile updates per hour
      message: 'Too many profile updates, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    }
  },

  // Search endpoints (per IP/user)
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 30,              // 30 searches per minute
    message: 'Too many search requests, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
  }
};