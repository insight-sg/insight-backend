import { Request, Response } from 'express';
import log from '../utils/logger';

export const speechToTextController = (req: Request, res: Response) => {
  try {
    //
    console.log('body :', req.body);
    console.log('params :', req.params);
    console.log('query :', req.query);
    if (!req.file) {
      log.info('[audioToText] No file from req.file');
    } else {
      log.info(req.file.filename);
    }
    return res.status(200).send({ message: 'Success', data: {} });
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
};
