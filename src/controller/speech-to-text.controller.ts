import { Request, Response } from 'express';
import log from '../utils/logger';

export const audioToText = (req: Request, res: Response) => {
  try {
    //
    console.log('body :', req.body);
    console.log('params :', req.params);
    console.log('query :', req.query);
    return res.status(200).send({ message: 'Success', data: {} });
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
};
