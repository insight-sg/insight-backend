import { Request, Response } from 'express';
import { createUserService, getUserService } from '../service/user.service';
import log from '../utils/logger';

export const getUserController = async (req: Request, res: Response) => {
  log.info('[getUserController]');
  try {
    const { username, password } = req.body;
    const user = await getUserService(username, password);

    console.log('subjects : ', user);
    if (!user) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { user } });
    }
  } catch (err: any) {
    log.error('Error in getAllSubjectController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  log.info('[createSubjectController]');
  try {
    const { username, password, email, name } = req.body;
    console.log(req.body);
    const user = await createUserService(username, password, email, name);

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
