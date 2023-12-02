import config from 'config';

import {
  createNoteBySubjectId,
  deleteNoteBySubjectId,
  getNoteBySubjectId,
} from '../models/note.model';
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from '@azure/ai-form-recognizer';
import { BlobServiceClient } from '@azure/storage-blob';
import { getBlobName } from '../utils/utilsfs';

export const createNotesBySubjectIdService = async (
  subject_id: number,
  note_title: string,
  note_url: string,
) => {
  const bloblUrl = config.get('storage_blob_url');
  const newNoteUrl = `${bloblUrl}${note_url}`;
  const result = await createNoteBySubjectId({
    note_title,
    subject_id,
    note_url: newNoteUrl,
  });

  if (result) {
    console.log(result);
    return result;
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

export const getTextFromAzureDocumentIntelligenceService = async (
  pdfUrl: string,
) => {
  const key = config.get<string>('document_intelligence_key');
  const endpoint = config.get<string>('document_intelligence_endpoint');

  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key),
  );

  const poller = await client.beginAnalyzeDocumentFromUrl(
    'prebuilt-document',
    pdfUrl,
  );

  const { content, pages, languages, styles } = await poller.pollUntilDone();

  const result = [];
  if (!pages || pages.length <= 0) {
    console.log('NO pages wwere extrasct from this documen');
  } else {
    console.log('Pages');
    for (const page of pages) {
      console.log('Page number ', page.pageNumber);
      if (page.lines && page.lines.length > 0) {
        for (const line of page.lines) {
          result.push(line.content);
        }
      }
    }
  }

  return result;
};

export const uploadPDFToStorageService = async (file: any) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    config.get('storage_connection_string'),
  );

  const containerClient = blobServiceClient.getContainerClient(
    config.get('storage_container_name'),
  );

  console.log('[uploadPDFToStorageService] : file : ', file);
  const blobName = getBlobName(file.originalname);
  const client = containerClient.getBlockBlobClient(blobName);

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
    console.log('Successful upload, bloblName : ', blobName);
    return blobName;
  }
};
