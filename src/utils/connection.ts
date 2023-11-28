import * as sql from 'mssql';
import log from './logger';
import config from 'config';

export const sqlConnect = async () => {
  try {
    return await sql.connect(config.get('config'));
  } catch (err) {
    log.error('Error on sqlConnect : ', err);
    console.error('Error on sqlConnect : ', err);
  }
};
