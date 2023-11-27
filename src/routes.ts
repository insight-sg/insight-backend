import { Express, NextFunction, Request, Response } from 'express';
import { validate } from './middleware/validateResource';
import { processFile } from './middleware/processFile';
import {
  createNoteBySubjectIdController,
  createSubjectController,
  getAllNoteBySubjectIdController,
  getAllSubjectByUserIdController,
  getAllSubjectController,
} from './controller/subject.controller';
import { speechToTextController } from './controller/speech-to-text.controller';

export const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => {
    console.log('Healthcheck hit');
    res.sendStatus(200);
  });

  app.post('/api/speechtotext', processFile, speechToTextController);

  app.get('/api/subjects', getAllSubjectController);
  app.get('/api/subjects/:user_id', getAllSubjectByUserIdController);
  app.get('/api/notes/:subject_id', getAllNoteBySubjectIdController);
  app.post('/api/subjects/', createSubjectController);
  app.post('/api/notes/', processFile, createNoteBySubjectIdController);
};
