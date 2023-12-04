import express, { Express } from 'express';
import config from 'config';
import cors from 'cors';
import logger from './utils/logger';
import { routes } from './routes';
import dotenv from 'dotenv';
dotenv.config();

const PORT = config.get<number>('port');
const app: Express = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  logger.info(`App is running at https://localhost:${PORT}`);
  routes(app);
});
