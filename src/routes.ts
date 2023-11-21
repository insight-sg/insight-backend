import { Express, Request, Response } from 'express';
import { audioToText } from './controller/speech-to-text.controller';
import { validate } from './middleware/validateResource';

export const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/speechtotext', audioToText);
};
