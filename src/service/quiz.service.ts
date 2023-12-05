import config from 'config';
import {
  createChoiceByQuestionId,
  createQuestionByQuizId,
  createQuizBySubjectId,
  getChoiceByQuestionId,
  getQuestionByQuizId,
  getQuizAttemptByQuizId,
  getQuizBySubjectId,
  updateQuizScoreByQuizId,
} from '../models/quiz.model';
import log from '../utils/logger';

export const createQuizBySubjectIdService = async (
  quiz_title: string,
  subject_id: number,
) => {
  const result = await createQuizBySubjectId({
    quiz_title,
    subject_id,
  });

  if (result) {
    console.log(result);
    return result;
  } else {
    console.log('null');
    return null;
  }
};

export const createQuestionByQuizIdService = async (
  quiz_id: number,
  question: string,
) => {
  const result = await createQuestionByQuizId({
    quiz_id,
    question,
  });

  if (result) {
    console.log(result);
    return result;
  } else {
    console.log('null');
    return null;
  }
};

export const createChoiceByQuestionIdService = async (
  question_id: number,
  choice: string,
  correct: boolean,
) => {
  log.info('createChoiceByQuestionIdService');
  console.log('question_id :', question_id);
  console.log('choice :', choice);
  console.log('choice :', choice);
  const result = await createChoiceByQuestionId({
    question_id,
    choice,
    correct,
  });

  if (result) {
    console.log(result);
    return result;
  } else {
    console.log('null');
    return null;
  }
};

export const getQuizBySubjectIdService = async (subject_id: number) => {
  const result = await getQuizBySubjectId(subject_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const getQuestionByQuizIdService = async (quiz_id: number) => {
  const result = await getQuestionByQuizId(quiz_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const getChoiceByQuestionIdService = async (question_id: number) => {
  log.info('[getChoiceByQuestionIdService]');
  const result = await getChoiceByQuestionId(question_id);

  if (result) {
    console.log('[getChoiceByQuestionIdService] result :', result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const getQuizAttemptsByQuizIdService = async (quiz_id: number) => {
  log.info('[getQuizAttemptsByQuizIdService]');
  const result = await getQuizAttemptByQuizId(quiz_id);

  if (result) {
    console.log('[getQuizAttemptsByQuizIdService] result :', result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const updateQuizScoreByQuizIdService = async (
  quiz_id: number,
  quiz_score: number,
) => {
  log.info('[getChoiceByQuestionIdService]');
  const result = await updateQuizScoreByQuizId(quiz_id, quiz_score);

  if (result) {
    console.log('[getChoiceByQuestionIdService] result :', result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};
