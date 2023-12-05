import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ message: 'Error', data: { error: 'Unauthorized access' } });
  }

  console.log('[validateToken]: ', req.headers.authorization);
  console.log('[validateToken] req.params: ', req.params);
  const secretKey = process.env.JWT_SECRET_KEY || 'secret';
  const token: string = req.headers.authorization.split(' ')[1];

  try {
    const credential: string | object = jwt.verify(token, secretKey);
    if (credential) {
      req.app.locals.credential = credential;
      return next();
    }
    return res
      .status(401)
      .send({ message: 'Error', data: { error: 'Invalid Token' } });
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Error', data: { error: 'Catch error :' + err } });
  }
};
