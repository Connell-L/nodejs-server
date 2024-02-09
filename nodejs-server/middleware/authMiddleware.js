import Jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    Jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
      if (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
};
