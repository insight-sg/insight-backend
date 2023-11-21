import pino from 'pino';
import dayjs from 'dayjs';

const log = pino({
  transport: {
    target: 'pino-pretty',
  },
});

export default log;
