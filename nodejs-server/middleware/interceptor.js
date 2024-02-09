import { Jwt } from 'jsonwebtoken';

export const interceptRequest = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (token) {
    Jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
      if (!error) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};
