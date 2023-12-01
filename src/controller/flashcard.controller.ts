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

export const createFlashcardBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createFlashcardBySubjectIdController]');
  try {
    const { flashcard_title, subject_id } = req.body;
    const flashcard = await createFlashcardBySubjectIdService(
      flashcard_title,
      subject_id,
    );

    if (!flashcard) {
      res.status(404).send({
        message: 'Error',
        data: { msg: 'Unable to create flashcard' },
      });
    } else {
      res.status(200).json({
        message: 'Success',
        data: { flashcard: flashcard.id },
      });
    }
  } catch (err: any) {
    log.error('Error in createFlashcardBySubjectIdController :', err);
    console.error('err ', err);
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
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllFlashcardBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subject_id } = req.params;
    const result = getFlashcardBySubjectIdService(Number(subject_id));

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getAllFlashcardBySubjectIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllFlashcardItemByFlashcardIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { flashcard_id } = req.params;
    const result = getFlashcardItemByFlashcardIdService(Number(flashcard_id));

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getAllFlashcardItemByFlashcardIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getFrontBackFromOpenAIController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { text_chunk } = req.body;
    const result = getFrontBackFromOpenAIService(text_chunk);

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getFrontBackFromOpenAIController :', err);
    console.error('err ', err);
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

    console.log('subjects : ', subjects);
    if (!subjects) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      console.log('subjects length : ');
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
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};
