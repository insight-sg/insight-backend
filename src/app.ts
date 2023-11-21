import express, { Express } from 'express';
import config from 'config';
import cors from 'cors';
import logger from './utils/logger';
import { routes } from './routes';

const port = config.get<number>('port');
const app: Express = express();

app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`);
  routes(app);
});
