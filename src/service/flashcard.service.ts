import {
  createFlashcardBySubjectId,
  createFlashcardItemByFlashcardId,
  deleteFlashcardBySubjectId,
  getFlashcardBySubjectId,
  getFlashcardItemByFlashcardId,
} from '../models/flashcard.model';

export const createFlashcardBySubjectIdService = async (
  flashcard_title: string,
  subject_id: number,
) => {
  const result = await createFlashcardBySubjectId({
    flashcard_title,
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

export const createFlashcardItemByFlashcardIdService = async (
  flashcard_id: number,
  flashcard_front: string,
  flashcard_back: string,
) => {
  console.log(
    '[createFlashcardItemByFlashcardIdService] flashcard_id :',
    flashcard_id,
  );
  const result = await createFlashcardItemByFlashcardId({
    flashcard_id,
    flashcard_front,
    flashcard_back,
  });

  if (result) {
    console.log(result);
    return result;
  } else {
    console.log('null');
    return null;
  }
};

export const getFlashcardBySubjectIdService = async (subject_id: number) => {
  const result = await getFlashcardBySubjectId(subject_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};
export const getFlashcardItemByFlashcardIdService = async (
  flashcard_id: number,
) => {
  const result = await getFlashcardItemByFlashcardId(flashcard_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};

export const deleteFlashcardBySubjectIdService = async (subject_id: number) => {
  const result = await deleteFlashcardBySubjectId(subject_id);

  if (result) {
    console.log(result);
    return result.recordset;
  } else {
    console.log('null');
    return null;
  }
};
