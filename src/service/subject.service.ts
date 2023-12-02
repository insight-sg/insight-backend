import { sqlConnect } from '../utils/connection';
import config from 'config';
import {
  createSubject,
  createUserSubject,
  deleteUserSubject,
  getSubjectByUserId,
  updateSubject,
} from '../models/subject.model';
import log from '../utils/logger';

export const getAllSubjectService = async () => {
  const pool = await sqlConnect();

  const result = await pool?.request().query('select * from subjects');

  if (result) {
    console.log(result?.recordset);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const createSubjectService = async (
  subject_title: string,
  subject_category: string,
  user_id: number,
) => {
  log.info('[createSubjectService]');
  const result_subject_id = await createSubject({
    subject_title,
    subject_category,
  });

  console.log('[result_subject_id] : ', result_subject_id);
  if (result_subject_id) {
    const result2 = await createUserSubject(result_subject_id, user_id);

    console.log('[result2] : ', result2);
    if (result2) {
      return result_subject_id;
    } else {
      console.log('null');
      return null;
    }
  } else {
    return null;
  }
};

export const getSubjectByUserIdService = async (user_id: number) => {
  log.info('[getSubjectByUserIdService]');
  console.log('[user_id] : ', user_id);
  const result = await getSubjectByUserId(user_id);
  console.log('[result] : ', result);
  if (result) {
    console.log(result?.recordset);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const deleteUserSubjectService = async (user_subjects_id: number) => {
  const result = await deleteUserSubject(user_subjects_id);
  if (result) {
    console.log(result?.recordset);

    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const updateSubjectIdService = async (
  subject_id: number,
  subject_category: string,
  subject_title: string,
) => {
  const result = await updateSubject({
    subject_id,
    subject_category,
    subject_title,
  });

  if (result) {
    console.log(result?.recordset);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};
