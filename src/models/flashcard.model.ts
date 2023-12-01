import { Int, VarChar } from 'mssql';
import { sqlConnect } from '../utils/connection';

export interface FlashcardItem {
  flashcard_item_id?: number;
  flashcard_id: number;
  flashcard_front: string;
  flashcard_back: string;
}

export interface Flashcard {
  flashcard_id?: number;
  flashcard_title: string;
  flashcard_items?: FlashcardItem[];
  subject_id: number;
}

export const createFlashcardBySubjectId = async ({
  flashcard_title,
  subject_id,
}: Flashcard) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('flashcard_title', VarChar, flashcard_title)
    .input('subject_id', Int, subject_id)
    .query(
      'INSERT INTO flashcard(flashcard_title,subject_id) VALUES(@flashcard_title,@subject_id); SELECT SCOPE_IDENTITY() AS id',
    );
  console.log(result);

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const createFlashcardItemByFlashcardId = async ({
  flashcard_id,
  flashcard_front,
  flashcard_back,
}: FlashcardItem) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('flashcard_front', VarChar, flashcard_front)
    .input('flashcard_back', VarChar, flashcard_back)
    .input('flashcard_id', Int, flashcard_id)
    .query(
      'INSERT INTO flashcard_item(flashcard_id,flashcard_front,flashcard_back) VALUES(@flashcard_id,@flashcard_front,@flashcard_back); SELECT SCOPE_IDENTITY() AS id',
    );
  console.log(result);

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const getFlashcardBySubjectId = async (subject_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('SELECT * FROM flashcard WHERE subject_id=@subject_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const getFlashcardItemByFlashcardId = async (flashcard_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('flashcard_id', Int, flashcard_id)
    .query('SELECT * FROM flashcard_item WHERE flashcard_id=@flashcard_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};

export const deleteFlashcardById = async (flashcard_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('flashcard_id', Int, flashcard_id)
    .query('DELETE FROM flashcards WHERE flashcard_id=@flashcard_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};
export const deleteFlashcardBySubjectId = async (subject_id: number) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('subject_id', Int, subject_id)
    .query('DELETE FROM flashcard WHERE subject_id=@subject_id');

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
};
export const updateFlashcard = async (
  flashcard_id: number,
  flashcard_title: string,
) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('flashcard_id', Int, flashcard_id)
    .query('SELECT * FROM flashcard WHERE flashcard_id=@flashcard_id');

  console.log(result);

  if (result?.recordset.length == 0) {
    return null;
  } else {
    const result = await pool
      ?.request()
      .input('flashcard_title', VarChar, flashcard_title)
      .input('flashcard_id', Int, flashcard_id)
      .query(
        'UPDATE flashcard SET flashcard_title=@flashcard_title WHERE flashcard_id=@flashcard_id',
      );

    console.log('updated : ', result);

    if (result) {
      return null;
    } else {
      return result;
    }
  }
};
