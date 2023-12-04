import * as sql from 'mssql';
import log from './logger';
import config from 'config';

export const sqlConnect = async () => {
  try {
    return await sql.connect({
      user: process.env.SQL_USER ?? '',
      password: process.env.SQL_PASSWORD ?? '',
      server: process.env.SQL_SERVER ?? '', //You can use 'localhost\\instance' to connect to named instance
      database: process.env.SQL_DB ?? '',
    });
  } catch (err) {
    log.error('Error on sqlConnect : ', err);
    console.error('Error on sqlConnect : ', err);
  }
};
