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
  updateUserController,
} from './controller/user.controller';
import { validateToken } from './middleware/validateToken';
export const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => {
    console.log('Healthcheck hit');
    res.sendStatus(200);
  });

  app.post('/api/speechtotext', processFile, speechToTextController);

  app.get('/api/loginuser/', getUserController);
  app.post('/api/registeruser', createUserController);
  app.put('/api/updateuser/', validateToken, updateUserController);

  app.get('/api/subjects', validateToken, getAllSubjectController);
  app.post('/api/subjects/', validateToken, createSubjectController);

  app.get(
    '/api/subjects/:user_id',
    validateToken,
    getAllSubjectByUserIdController,
  );
  app.get(
    '/api/subjects/note/:user_id',
    validateToken,
    getAllNotesByUserIdController,
  );
  app.get(
    '/api/subjects/flashcard/:user_id',
    validateToken,
    getAllFlashcardbyUserIdController,
  );
  app.get(
    '/api/subjects/quiz/:user_id',
    validateToken,
    getAllQuizzesbyUserIdController,
  );

  app.post(
    '/api/notes/',
    validateToken,
    processFile,
    createNoteBySubjectIdController,
  );
  app.get(
    '/api/notes/:subject_id',
    validateToken,
    getAllNoteBySubjectIdController,
  );

  app.post(
    '/api/flashcard/',
    validateToken,
    createFlashcardBySubjectIdController,
  );
  app.post(
    '/api/flashcarditem/',
    validateToken,
    createFlashcardItemByFlashcardIdController,
  );
  app.post(
    '/api/generateflashcard/',
    validateToken,
    getFrontBackFromOpenAIController,
  );

  app.get(
    '/api/flashcard/:subject_id',
    validateToken,
    getAllFlashcardBySubjectIdController,
  );
  app.get(
    '/api/flashcarditem/:flashcard_id',
    validateToken,
    getAllFlashcardItemByFlashcardIdController,
  );
  app.post('/api/quiz/', validateToken, createQuizBySubjectIdController);
  app.post('/api/question/', validateToken, createQuestionByQuizIdController);
  app.post('/api/choice/', validateToken, createChoiceByQuestionIdController);
  app.post(
    '/api/generatequiz/',
    validateToken,
    getQuestionAndAnswerFromOpenAIController,
  );

  app.post('/api/quizscore/', validateToken, updateQuizScoreByQuizIdController);

  app.get(
    '/api/quiz/:subject_id',
    validateToken,
    getAllQuizBySubjectIdController,
  );
  app.get(
    '/api/question/:quiz_id',
    validateToken,
    getQuestionByQuizIdController,
  );
  app.get('/api/choice/', validateToken, getChoiceByQuestionIdController);
};
