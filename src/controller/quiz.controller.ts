import { Request, Response } from 'express';

import log from '../utils/logger';
import {
  createChoiceByQuestionIdService,
  createQuestionByQuizIdService,
  createQuizBySubjectIdService,
  getChoiceByQuestionIdService as getChoiceByQuestionIdService,
  getQuestionByQuizIdService,
  getQuizBySubjectIdService,
} from '../service/quiz.service';
import { getSubjectByUserIdService } from '../service/subject.service';

export const createQuizBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createQuizBySubjectIdController]');
  try {
    const { quiz_title, subject_id } = req.body;

    const quiz = await createQuizBySubjectIdService(quiz_title, subject_id);

    if (!quiz) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Unable to create quiz' } });
    } else {
      res.status(200).json({
        message: 'Success',
        data: { quiz_id: quiz },
      });
    }
  } catch (err: any) {
    log.error('Error in createQuizBySubjectIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const createQuestionByQuizIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createQuestionByQuizIdController]');
  try {
    const { quiz_id, question } = req.body;

    const questionresult = await createQuestionByQuizIdService(
      quiz_id,
      question,
    );

    if (!questionresult) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Unable to create question' } });
    } else {
      res.status(200).json({
        message: 'Success',
        data: { question_id: questionresult },
      });
    }
  } catch (err: any) {
    log.error('Error in createQuestionByQuizIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const createChoiceByQuestionIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createChoiceByQuestionIdController]');
  try {
    const { question_id, choice, correct } = req.body;

    const choiceresult = await createChoiceByQuestionIdService(
      question_id,
      choice,
      correct,
    );

    if (!choiceresult) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Unable to create choice' } });
    } else {
      res.status(200).json({
        message: 'Success',
        data: { choice_id: choiceresult },
      });
    }
  } catch (err: any) {
    log.error('Error in createChoiceByQuestionIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllQuizzesbyUserIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id } = req.params;
    const subjects = await getSubjectByUserIdService(Number(user_id));

    console.log('subjects : ', subjects);
    if (!subjects) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      console.log('subjects length : ');
      for (let i = 0; i < subjects.length; i++) {
        subjects[i].quizzes = await getQuizBySubjectIdService(
          subjects[i].subject_id,
        );
        for (let j = 0; j < subjects[i].quizzes.length; j++) {
          subjects[i].quizzes[j].questions = await getQuestionByQuizIdService(
            subjects[i].quizzes[j].quiz_id,
          );
          for (let k = 0; k < subjects[i].quizzes[j].questions.length; k++) {
            console.log('i , j , k : ', i, j, k);
            subjects[i].quizzes[j].questions[k].choice =
              await getChoiceByQuestionIdService(
                subjects[i].quizzes[j].questions[k].question_id,
              );
          }
        }
      }
      res.status(200).send({ message: 'Success', data: { subjects } });
    }
  } catch (err: any) {
    log.error('Error in getAllQuizzesbyUserIdController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllQuizBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subject_id } = req.params;
    const result = getQuizBySubjectIdService(Number(subject_id));

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getAllQuizBySubjectIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getQuestionByQuizIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { quiz_id } = req.params;
    const result = getQuestionByQuizIdService(Number(quiz_id));

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getQuestionByQuizIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getChoiceByQuestionIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { question_id } = req.params;
    const result = getChoiceByQuestionIdService(Number(question_id));

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getChoiceByQuestionIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};
