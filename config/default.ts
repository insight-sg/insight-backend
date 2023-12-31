import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  config: {
    user: process.env.SQL_USER ?? '',
    password: process.env.SQL_PASSWORD ?? '',
    server: process.env.SQL_SERVER ?? '', //You can use 'localhost\\instance' to connect to named instance
    database: process.env.SQL_DB ?? '',
  },
  storage_connection_string: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
  storage_container_name: process.env.AZURE_STORAGE_CONTAINER_NAME ?? '',
  storage_blob_url: process.env.AZURE_STORAGE_BLOB_URL ?? '',
  document_intelligence_key: process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY ?? '',
  document_intelligence_endpoint:
    process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT ?? '',
  openai_endpoint: process.env.AZURE_OPENAI_ENDPOINT ?? '',
  openai_key: process.env.AZURE_OPENAI_KEY ?? '',
};
