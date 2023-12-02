import { Request, Response } from 'express';

import {
  createNotesBySubjectIdService,
  getNotesBySubjectIdService,
  getTextFromAzureDocumentIntelligenceService,
} from '../service/note.service';
import { uploadPDFToStorageService } from '../service/note.service';
import log from '../utils/logger';

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

    const textResponse =
      await getTextFromAzureDocumentIntelligenceService(uploadResponse);

    if (!textResponse) {
      res.status(404).send({
        message: 'Error',
        data: { msg: 'Failed to extract text from pdf' },
      });
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
      res.status(200).json({
        message: 'Success',
        data: { note_id: note.id, text: textResponse },
      });
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
