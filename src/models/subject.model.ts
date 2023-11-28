import { Int, VarChar } from 'mssql';
import { sqlConnect } from '../utils/connection';
import log from '../utils/logger';
import { deleteNoteBySubjectId } from './note.model';

export interface Subject {
  subject_id?: number;
  subject_title: string;
  subject_category: string;
}

export const createSubject = async ({
  subject_title,
  subject_category,
}: Subject) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_title', VarChar, subject_title)
    .input('subject_category', VarChar, subject_category)
    .query(
      'INSERT INTO subjects(subject_title,subject_category) VALUES(@subject_title,@subject_category); SELECT SCOPE_IDENTITY() AS id',
    );
  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const createUserSubject = async (
  subject_id: number,
  user_id: number,
) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .input('user_id', Int, user_id)
    .query(
      'INSERT INTO user_subjects(subject_id,user_id) VALUES(@subject_id,@user_id); SELECT SCOPE_IDENTITY() AS id',
    );

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const getSubjectByUserId = async (user_id: number) => {
  log.info('[getSubjectByUserId]');
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('user_id', Int, user_id)
    .query(
      'SELECT us.user_subjects_id,s.subject_id,s.subject_title,s.subject_category,s.created_at,s.updated_at FROM subjects s LEFT JOIN user_subjects us ON us.subject_id = s.subject_id WHERE user_id=@user_id',
    );

  console.log('result :', result);

  return result;
};

export const deleteUserSubject = async (user_subjects_id: number) => {
  const pool = await sqlConnect();

  const select = await pool
    ?.request()
    .input('user_subjects_id', Int, user_subjects_id)
    .query(
      'SELECT * FROM user_subjects WHERE user_subjects_id=@user_subjects_id',
    );

  if (select) {
    const result = await pool
      ?.request()
      .input('user_subjects_id', Int, user_subjects_id)
      .query(
        'DELETE FROM user_subjects WHERE user_subjects_id=@user_subjects_id',
      );

    if (result) {
      const subject_id = select.recordset[0].subject_id;

      const result1 = await deleteNoteBySubjectId(subject_id);
      const result2 = await deleteSubjectById(subject_id);

      return result ? result2?.recordset[0] && result1?.recordset[0] : null;
    } else {
      return null;
    }
  }
};

export const deleteSubjectById = async (subject_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('DELETE FROM subjects WHERE subject_id=@subject_id');

  console.log(result);

  return result;
};

export const updateSubject = async ({
  subject_id,
  subject_category,
  subject_title,
}: Subject) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('SELECT * FROM subjects WHERE subject_id=@subject_id');

  console.log(result);

  if (result?.recordset.length == 0) {
    return null;
  } else {
    const result = await pool
      ?.request()
      .input('subject_category', VarChar, subject_category)
      .input('subject_title', VarChar, subject_title)
      .input('subject_id', Int, subject_id)
      .query(
        'UPDATE subjects SET subject_category=@subject_category,subject_title=@subject_title WHERE subject_id=@subject_id',
      );

    console.log('updated : ', result);

    if (result?.recordset.length == 0) {
      return null;
    } else {
      return result?.recordset[0].user_id;
    }
  }
};
