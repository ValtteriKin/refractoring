import { rateLimit } from 'express-rate-limit'

//default IP-based limiting (for auth)
export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, 
    limit: 3, 
    standardHeaders: 'draft-6',
    legacyHeaders: false,

    message: {
        error: 'Too many request. Try again later'
    }
})

//default req.user-based limiting (for auth)
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, 
    limit: 10, 
    standardHeaders: 'draft-6',
    legacyHeaders: false,
    keyGenerator: (req) => req.user,
    
    message: {
        error: 'Too many request. Try again later'
    }
})