import dotenv from 'dotenv';

dotenv.config();

export default {
  port: 8080,
  config: {
    user: process.env.SQL_USER ?? '',
    password: process.env.SQL_PASSWORD ?? '',
    server: process.env.SQL_SERVER ?? '', //You can use 'localhost\\instance' to connect to named instance
    database: process.env.SQL_DB ?? '',
  },
  storage_connection_string: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
  storage_container_name: process.env.AZURE_STORAGE_CONTAINER_NAME ?? '',
  storage_blob_url: process.env.AZURE_STORAGE_BLOB_URL ?? '',
};
