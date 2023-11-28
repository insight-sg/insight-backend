import { Request, Response } from 'express';
import {
  createNotesBySubjectIdService,
  createSubjectService,
  deleteUserSubjectService,
  getAllSubjectService,
  getNotesBySubjectIdService,
  getSubjectByUserIdService,
  uploadPDFToStorageService,
} from '../service/subject.service';
import log from '../utils/logger';

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

export const createNoteBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  log.info('[createNoteBySubjectIdController]');
  try {
    const { subject_id, note_title } = req.body;
    const file = req.file;
    console.log('req.file ', req.file);
    if (!file) {
      res.status(404).send({ message: 'Error', data: { msg: 'No file' } });
      return;
    }

    const uploadResponse = await uploadPDFToStorageService(file);

    if (!uploadResponse) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Failed to upload pdf' } });
      return;
    }

    const note = await createNotesBySubjectIdService(
      subject_id,
      note_title,
      uploadResponse,
    );

    if (!note) {
      res
        .status(404)
        .send({ message: 'Error', data: { msg: 'Unable to create note' } });
    } else {
      res.status(200).send({ message: 'Success', data: { note_id: note.id } });
    }
  } catch (err: any) {
    log.error('Error in createNoteBySubjectIdController :', err);
    console.error('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllNoteBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subject_id } = req.params;
    const result = getNotesBySubjectIdService(Number(subject_id));

    console.log(result);

    if (!result) {
      res.status(404).send({ message: 'Error', data: {} });
    } else {
      res.status(200).send({ message: 'Success', data: { result } });
    }
  } catch (err: any) {
    log.error('Error in getAllSubjectController :', err);
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
