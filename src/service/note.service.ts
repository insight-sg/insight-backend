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
  note_text_chunk: string[],
) => {
  const result = await createNoteBySubjectId({
    note_title,
    subject_id,
    note_url,
    note_text_chunk: note_text_chunk.join(' '),
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
  const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY ?? '';
  const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT ?? '';
  const storage_blob_url = process.env.AZURE_STORAGE_BLOB_URL;

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
    process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
  );

  const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME ?? '',
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
