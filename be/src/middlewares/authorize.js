import { ForbiddenError } from '../exceptions/error.js';

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Akses ditolak: User tidak terotentikasi'));
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Akses ditolak: Hak akses tidak mencukupi'));
    }
    next();
  };
};

export default authorize;
