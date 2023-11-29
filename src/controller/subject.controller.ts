import { Request, Response } from 'express';
import {
  createSubjectService,
  deleteUserSubjectService,
  getAllSubjectService,
  getSubjectByUserIdService,
} from '../service/subject.service';
import log from '../utils/logger';
import { getNotesBySubjectIdService } from '../service/note.service';

export const getAllSubjectController = async (req: Request, res: Response) => {
  try {
    log.info('getAllSubjectController');
    const result = await getAllSubjectService();

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getAllSubjectController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const createSubjectController = async (req: Request, res: Response) => {
  log.info('[createSubjectController]');
  try {
    const { subject_title, subject_category, user_id } = req.body;
    console.log(req.body);
    const subjects = await createSubjectService(
      subject_title,
      subject_category,
      user_id,
    );

    console.log('subjects : ', subjects);
    if (!subjects) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Failed insert subject' } });
    } else {
      res
        .status(200)
        .send({ message: 'Success', data: { subject_id: subjects } });
    }
  } catch (err: any) {
    log.error('Error in createSubjectController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllSubjectByUserIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[getAllSubjectByUserIdController]');
  try {
    const { user_id } = req.params;
    const subjects = await getSubjectByUserIdService(Number(user_id));

    console.log('subjects : ', subjects);
    if (!subjects) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      for (let i = 0; i < subjects.length; i++) {
        subjects[i].notes = await getNotesBySubjectIdService(
          subjects[i].subject_id,
        );
      }
      res.status(200).send({ message: 'Success', data: { subjects } });
    }
  } catch (err: any) {
    log.error('Error in getAllSubjectController :');
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const deleteSubjectBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subject_id } = req.params;
    const result = deleteUserSubjectService(Number(subject_id));
    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in deleteSubjectBySubjectId :', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

// export const getTextFromAzureDocumentIntelligenceController = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const result = await getTextFromAzureDocumentIntelligenceService();
//     console.log(result);

//     if (!result) {
//       res.status(404).send({ message: 'Error', data: {} });
//     } else {
//       res.status(200).send({ message: 'Success', data: { pages: result } });
//     }
//   } catch (err: any) {
//     log.error('Error in getTextFromAzureDocumentIntelligenceController :', err);
//     res.status(500).send({ message: 'Internal Service Error', data: {} });
//   }
// };
