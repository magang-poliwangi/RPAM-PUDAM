import rateLimit from 'express-rate-limit';
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { status: 'fail', message: 'Too many login attempts, try again in 5 minutes' }
});
