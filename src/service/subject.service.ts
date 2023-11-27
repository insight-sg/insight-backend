import { Int, VarChar } from 'mssql';
import { sqlConnect } from '../utils/connection';
import config from 'config';
import {
  createSubject,
  createUserSubject,
  deleteSubjectById,
  deleteUserSubject,
  getSubjectByUserId,
  updateSubject,
} from '../models/subject.model';
import {
  deleteNoteById,
  deleteNoteBySubjectId,
  getNoteBySubjectId,
} from '../models/note.model';
import log from '../utils/logger';
import { BlobServiceClient } from '@azure/storage-blob';

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
      return result2;
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

export const uploadPDFToStorageService = async (file: any) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    config.get('storage_connection_string'),
  );

  const containerClient = blobServiceClient.getContainerClient(
    config.get('storage_container_name'),
  );

  const client = containerClient.getBlockBlobClient(file.filename);

  const response = await client.uploadData(file, {
    blobHTTPHeaders: {
      blobContentType: 'application/pdf',
    },
  });

  console.log(response);
  if (response._response.status !== 201) {
    // throw new Error(
    //   `Error uploading document ${client.name} to container ${client.containerName}`,
    // );
    return null;
  } else {
    console.log(response);
    return response;
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

export const getNotesBySubjectIdService = async (subject_id: number) => {
  const result = await getNoteBySubjectId(subject_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const deleteNotesBySubjectIdService = async (subject_id: number) => {
  const result = await deleteNoteBySubjectId(subject_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};
