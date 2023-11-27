import { Int, VarChar } from 'mssql';
import { sqlConnect } from '../utils/connection';

export interface Note {
  note_id?: number;
  note_title: string;
  note_url?: string;
  subject_id: number;
}

export const createNoteBySubjectId = async ({
  note_title,
  subject_id,
  note_url,
}: Note) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('note_title', VarChar, note_title)
    .input('subject_id', Int, subject_id)
    .input('note_url', Int, note_url)
    .query(
      'INSERT INTO note(note_title,subject_id,note_url) VALUES(@note_title,@subject_id,@note_url)',
    );

  console.log(result);

  if (result && result?.recordset[0]) {
    return result?.recordset[0].note_id;
  }
  return null;
};

export const getNoteBySubjectId = async (subject_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('SELECT * FROM notes WHERE subject_id=@subject_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const deleteNoteById = async (note_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('note_id', Int, note_id)
    .query('DELETE FROM notes WHERE note_id=@note_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};
export const deleteNoteBySubjectId = async (subject_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('DELETE FROM notes WHERE subject_id=@subject_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};
export const updateNote = async (note_id: number, note_title: string) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('note_id', Int, note_id)
    .query('SELECT * FROM note WHERE note_id=@note_id');

  console.log(result);

  if (result?.recordset.length == 0) {
    return null;
  } else {
    const result = await pool
      ?.request()
      .input('note_title', VarChar, note_title)
      .input('note_id', Int, note_id)
      .query('UPDATE notes SET note_title=@note_title WHERE note_id=@note_id');

    console.log('updated : ', result);

    if (result) {
      return null;
    } else {
      return result;
    }
  }
};
