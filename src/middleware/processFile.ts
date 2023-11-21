import util from 'util';
import multer from 'multer';

const maxSize = 30 * 1024 * 1024;

export const processFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('audioFile');

export const processFileMiddleware = util.promisify(processFile);
