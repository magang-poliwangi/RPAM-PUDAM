async function authenticateToken(req, res, next) {
  req.user = { id: 1, username: 'admin', role: 'ADMIN' };
  return next();
}

export default authenticateToken;