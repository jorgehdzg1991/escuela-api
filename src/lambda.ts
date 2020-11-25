import awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
];

const server = awsServerlessExpress.createServer(
  app,
  undefined,
  binaryMimeTypes
);

// eslint-disable-next-line import/prefer-default-export
export const handler = (event: any, context: any): any => {
  return awsServerlessExpress.proxy(server, event, context);
};
