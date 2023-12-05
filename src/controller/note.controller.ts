import { Request, Response } from 'express';
import config from 'config';
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
    console.log('req.body : ', req.body);
    const data = req.body.data;
    console.log('data ; ', data);
    const parsedBody = JSON.parse(req.body.data);
    console.log('print out parsedBody : ', parsedBody);
    const { subject_id, note_title } = parsedBody;
    console.log('print out req : ', parsedBody);
    console.log('[createNoteBySubjectIdController] subject id : ', subject_id);
    console.log(
      '[createNoteBySubjectIdController] note_title id : ',
      note_title,
    );
    const file = req.file;
    console.log('[createNoteBySubjectIdController] req.file ', req.file);
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

    console.log(
      '[createNoteBySubjectIdController] uploadResponse ',
      uploadResponse,
    );
    const bloblUrl = process.env.AZURE_STORAGE_CONTAINER_URL;
    const newNoteUrl = `${bloblUrl}${uploadResponse}`;
    const textResponse =
      await getTextFromAzureDocumentIntelligenceService(newNoteUrl);

    console.log(
      '[createNoteBySubjectIdController] uploadResponse ',
      textResponse,
    );
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
      newNoteUrl,
      textResponse,
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
    console.log('err ', err);
    res.status(500).send({ message: 'Internal Service Error', data: {} });
  }
};

export const getAllNoteBySubjectIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subject_id } = req.params;
    const result = await getNotesBySubjectIdService(Number(subject_id));

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
