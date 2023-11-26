import { Express, NextFunction, Request, Response } from 'express';
import { speechToTextController } from './controller/speech-to-text.controller';
import { validate } from './middleware/validateResource';
import { processFile } from './middleware/processFile';

export const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => {
    console.log('Healthcheck hit');
    res.sendStatus(200);
  });

  app.post('/api/speechtotext', processFile, speechToTextController);
};
