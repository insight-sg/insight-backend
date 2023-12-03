import { Express, NextFunction, Request, Response } from 'express';
import { validate } from './middleware/validateResource';
import { processFile } from './middleware/processFile';
import {
  createSubjectController,
  getAllNotesByUserIdController,
  getAllSubjectByUserIdController,
  getAllSubjectController,
} from './controller/subject.controller';
import { speechToTextController } from './controller/speech-to-text.controller';
import {
  createNoteBySubjectIdController,
  getAllNoteBySubjectIdController,
} from './controller/note.controller';
import {
  createFlashcardBySubjectIdController,
  createFlashcardItemByFlashcardIdController,
  getAllFlashcardBySubjectIdController,
  getAllFlashcardItemByFlashcardIdController,
  getAllFlashcardbyUserIdController,
  getFrontBackFromOpenAIController,
} from './controller/flashcard.controller';
import {
  createChoiceByQuestionIdController,
  createQuestionByQuizIdController,
  createQuizBySubjectIdController,
  getAllQuizBySubjectIdController,
  getAllQuizzesbyUserIdController,
  getChoiceByQuestionIdController,
  getQuestionAndAnswerFromOpenAIController,
  getQuestionByQuizIdController,
  updateQuizScoreByQuizIdController,
} from './controller/quiz.controller';
import {
  createUserController,
  getUserController,
} from './controller/user.controller';
export const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => {
    console.log('Healthcheck hit');
    res.sendStatus(200);
  });

  app.post('/api/speechtotext', processFile, speechToTextController);

  app.get('/api/loginuser/', getUserController);
  app.post('/api/registeruser', createUserController);

  app.get('/api/subjects', getAllSubjectController);
  app.post('/api/subjects/', createSubjectController);

  app.get('/api/subjects/:user_id', getAllSubjectByUserIdController);
  app.get('/api/subjects/note/:user_id', getAllNotesByUserIdController);
  app.get(
    '/api/subjects/flashcard/:user_id',
    getAllFlashcardbyUserIdController,
  );
  app.get('/api/subjects/quiz/:user_id', getAllQuizzesbyUserIdController);

  app.post('/api/notes/', processFile, createNoteBySubjectIdController);
  app.get('/api/notes/:subject_id', getAllNoteBySubjectIdController);

  app.post('/api/flashcard/', createFlashcardBySubjectIdController);
  app.post('/api/flashcarditem/', createFlashcardItemByFlashcardIdController);
  app.post('/api/generateflashcard/', getFrontBackFromOpenAIController);

  app.get('/api/flashcard/:subject_id', getAllFlashcardBySubjectIdController);
  app.get(
    '/api/flashcarditem/:flashcard_id',
    getAllFlashcardItemByFlashcardIdController,
  );
  app.post('/api/quiz/', createQuizBySubjectIdController);
  app.post('/api/question/', createQuestionByQuizIdController);
  app.post('/api/choice/', createChoiceByQuestionIdController);
  app.post('/api/generatequiz/', getQuestionAndAnswerFromOpenAIController);

  app.post('/api/quizscore/', updateQuizScoreByQuizIdController);

  app.get('/api/quiz/:subject_id', getAllQuizBySubjectIdController);
  app.get('/api/question/', getQuestionByQuizIdController);
  app.get('/api/choice/', getChoiceByQuestionIdController);
};
