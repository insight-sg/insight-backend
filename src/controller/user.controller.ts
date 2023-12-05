import { Request, Response } from 'express';
import {
  createUserService,
  getExistingUserService,
  getUserService,
  updateUserService,
} from '../service/user.service';
import log from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUserController = async (
  req: Request<any, any, any, { username?: string; password?: string }>,
  res: Response,
) => {
  log.info('[getUserController]');
  try {
    const { username, password } = req.query;

    if (!username || !password) {
      res.status(400).send({
        message: 'Bad Request: Missing username or password',
        data: {},
      });
      return;
    }

    const user = await getUserService(username);
    console.log('[getUserController] [result] : ', user);
    if (!user) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'User does not exist' } });
    } else {
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).send({
          message: 'Error',
          data: { msg: 'Incorrect credentials' },
        });
      } else {
        const secretKey = process.env.JWT_SECRET_KEY || 'secret';
        const payload = {
          user_id: user.user_id,
          username: user.username,
          name: user.name,
          email: user.email,
        };
        const option = { expiresIn: process.env.JWT_EXPIRES_IN };
        const access_token = jwt.sign(payload, secretKey, option);
        return res.status(200).send({
          message: 'Success',
          data: { user: { ...payload, access_token, password } },
        });
      }

      return res.status(200).send({ message: 'yes', data: { user: 'user' } });
    }
  } catch (err: any) {
    log.error('Error in getUserController :', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};
export const createUserController = async (req: Request, res: Response) => {
  log.info('[createSubjectController]');
  try {
    const { username, password, email, name } = req.body;

    const ifExistUser = await getExistingUserService(username, email);

    if (ifExistUser) {
      return res.status(400).send({
        message: 'Error',
        data: { msg: 'Username or email already exist' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserService(username, hashedPassword, email, name);

    console.log('user : ', user);
    if (!user) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Failed insert subject' } });
    } else {
      res.status(200).send({ message: 'Success', data: { subject_id: user } });
    }
  } catch (err: any) {
    log.error('Error in createSubjectController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  log.info('[updateUserController]');
  try {
    const { user_id, username, password, email, name } = req.body;
    console.log(req.body);
    const user = await updateUserService(
      user_id,
      username,
      password,
      email,
      name,
    );

    console.log('user : ', user);
    if (!user) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Failed update user' } });
    } else {
      res.status(200).send({ message: 'Success', data: { user_id: user } });
    }
  } catch (err: any) {
    log.error('Error in updateUserController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};
