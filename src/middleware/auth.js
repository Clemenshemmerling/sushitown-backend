import jwt from 'jsonwebtoken';
export function auth (req,res,next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!t) return res.status(401).json({error: 'unauthorized'});
  try {
    const p = jwt.verify(t, process.env.JWT_SECRET);
    req.user = p;
    next();
  } catch(e) {
    res.status(401).json({error: 'unauthorized'});
  }
}
export function requireRole (...roles) {
  return (req,res,next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({error: 'forbidden'});
    next();
  }
}
