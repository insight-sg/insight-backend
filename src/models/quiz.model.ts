import { Bit, Int, VarChar } from 'mssql';
import { sqlConnect } from '../utils/connection';

export interface Choice {
  choice_id?: number;
  question_id: number;
  choice: string;
  correct: boolean;
}

export interface Questions {
  question_id?: number;
  quiz_id: number;
  question: string;
  choice?: Choice[];
}

export interface Quiz {
  quiz_id?: number;
  quiz_title: string;
  subject_id: number;
  quiz_score?: number;
  questions?: Questions[];
}

export const createQuizBySubjectId = async ({
  quiz_title,
  subject_id,
}: Quiz) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('quiz_title', VarChar, quiz_title)
    .input('subject_id', Int, subject_id)
    .query(
      'INSERT INTO quiz(quiz_title,subject_id) VALUES(@quiz_title,@subject_id); SELECT SCOPE_IDENTITY() AS id',
    );
  console.log(result);

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const createQuestionByQuizId = async ({
  quiz_id,
  question,
}: Questions) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('quiz_id', Int, quiz_id)
    .input('question', VarChar, question)
    .query(
      'INSERT INTO questions(quiz_id,question) VALUES(@quiz_id,@question); SELECT SCOPE_IDENTITY() AS id',
    );
  console.log(result);

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const createChoiceByQuestionId = async ({
  question_id,
  choice,
  correct,
}: Choice) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('question_id', Int, question_id)
    .input('choice', VarChar, choice)
    .input('correct', Bit, correct)
    .query(
      'INSERT INTO question_choice(question_id,choice,correct) VALUES(@question_id,@choice,@correct); SELECT SCOPE_IDENTITY() AS id',
    );
  console.log(result);

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const getQuizBySubjectId = async (subject_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('SELECT * FROM quiz WHERE subject_id=@subject_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const getQuestionByQuizId = async (quiz_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('quiz_id', Int, quiz_id)
    .query('SELECT * FROM questions WHERE quiz_id=@quiz_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const getChoiceByQuestionId = async (question_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('question_id', Int, question_id)
    .query('SELECT * FROM question_choice WHERE question_id=@question_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const updateQuizScoreByQuizId = async (
  quiz_id: number,
  quiz_score: number,
) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('quiz_id', Int, quiz_id)
    .query('SELECT * FROM quiz WHERE quiz_id=@quiz_id');

  console.log(result);

  if (result?.recordset.length == 0) {
    return null;
  } else {
    const insertQuizAttempt = await pool
      ?.request()
      .input('quiz_id', Int, quiz_id)
      .input('quiz_score', Int, quiz_score)
      .query(
        'INSERT INTO quiz_attempts (quiz_id,quiz_score) VALUES (@quiz_id,@quiz_score)',
      );

    if (insertQuizAttempt) {
      const result = await pool
        ?.request()
        .input('quiz_score', Int, quiz_score)
        .input('quiz_id', Int, quiz_id)
        .query('UPDATE quiz SET quiz_score=@quiz_score WHERE quiz_id=@quiz_id');

      console.log('updated : ', result);

      if (result) {
        return result;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};

export const deleteQuizById = async (quiz_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('quiz_id', Int, quiz_id)
    .query('DELETE FROM quiz WHERE quiz_id=@quiz_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const getQuizAttemptByQuizId = async (quiz_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('quiz_id', Int, quiz_id)
    .query('SELECT * FROM quiz_attempts WHERE quiz_id=@quiz_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};
