import { Request, Response } from 'express';

import log from '../utils/logger';
import {
  createFlashcardBySubjectIdService,
  createFlashcardItemByFlashcardIdService,
  getFlashcardBySubjectIdService,
  getFlashcardItemByFlashcardIdService,
} from '../service/flashcard.service';
import { getFrontBackFromOpenAIService } from '../service/openai.service';
import { getSubjectByUserIdService } from '../service/subject.service';
import { Int, VarChar } from 'mssql';
import { sqlConnect } from 'utils/connection';

export const createFlashcardBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createFlashcardBySubjectIdController]');
  try {
    const { subject_id, flashcard_title, flashcards } = req.body;
    const flashcard = await createFlashcardBySubjectIdService(
      flashcard_title,
      subject_id,
    );
    console.log('flashcard result create flashcardbysubjectid : ', flashcard);
    if (!flashcard) {
      res.status(404).send({
        message: 'Error',
        data: { msg: 'Unable to create flashcard' },
      });
    } else {
      for (let i = 0; i < flashcards.length; i++) {
        await createFlashcardItemByFlashcardIdService(
          flashcard,
          flashcards[i].FRONT,
          flashcards[i].BACK,
        );
      }
      res.status(200).json({
        message: 'Success',
        data: { flashcard: flashcard },
      });
    }
  } catch (err: any) {
    log.error('Error in createFlashcardBySubjectIdController :', err);
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const createFlashcardItemByFlashcardIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createFlashcardItemByFlashcardIdController]');
  try {
    const { flashcard_id, flashcard_front, flashcard_back } = req.body;
    const flashcard = await createFlashcardItemByFlashcardIdService(
      flashcard_id,
      flashcard_front,
      flashcard_back,
    );

    if (!flashcard) {
      res.status(404).send({
        message: 'Error',
        data: { msg: 'Unable to create flashcard item' },
      });
    } else {
      res.status(200).json({
        message: 'Success',
        data: { flashcard: flashcard.id },
      });
    }
  } catch (err: any) {
    log.error('Error in createFlashcardItemByFlashcardIdController :', err);
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllFlashcardBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subject_id } = req.params;
    const flashcards = await getFlashcardBySubjectIdService(Number(subject_id));

    // console.log('getFlashcardBySubjectIdService result :', flashcards);

    if (!flashcards) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      for (let i = 0; i < flashcards.length; i++) {
        flashcards[i].flashcard_item =
          await getFlashcardItemByFlashcardIdService(
            flashcards[i].flashcard_id,
          );
      }

      res.status(200).send({ message: 'Success', data: { flashcards } });
    }
  } catch (err: any) {
    log.error('Error in getAllFlashcardBySubjectIdController :', err);
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllFlashcardItemByFlashcardIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    log.info('[getAllFlashcardItemByFlashcardIdController]');
    const { flashcard_id } = req.params;
    const result = await getFlashcardItemByFlashcardIdService(
      Number(flashcard_id),
    );

    // console.log('result from getFlashcardItemByFlashcardIdService : ', result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getAllFlashcardItemByFlashcardIdController :', err);
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getFrontBackFromOpenAIController = async (
  req: Request,
  res: Response,
) => {
  try {
    log.info('[getFrontBackFromOpenAIController]');
    const { text_chunk } = req.body;
    console.log('text_chunk : ', text_chunk);
    const result = await getFrontBackFromOpenAIService(text_chunk);

    // console.log('getFrontBackFromOpenAIService result :', result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getFrontBackFromOpenAIController :', err);
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllFlashcardbyUserIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id } = req.params;
    const subjects = await getSubjectByUserIdService(Number(user_id));

    // console.log('subjects : ', subjects);
    if (!subjects) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      for (let i = 0; i < subjects.length; i++) {
        subjects[i].flashcards = await getFlashcardBySubjectIdService(
          subjects[i].subject_id,
        );
        for (let j = 0; j < subjects[i].flashcards.length; j++) {
          subjects[i].flashcards[j].flashcard_item =
            await getFlashcardItemByFlashcardIdService(
              subjects[i].flashcards[j].flashcard_id,
            );
        }
      }
      res.status(200).send({ message: 'Success', data: { subjects } });
    }
  } catch (err: any) {
    log.error('Error in getAllFlashcardbyUserIdController :');
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};
