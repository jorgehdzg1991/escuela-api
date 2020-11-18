import express, { Request, Response } from 'express';
import dynamoose from 'dynamoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OK } from 'http-status-codes';
import respond from './utils/response';
import AlumnoApi from './api/AlumnoApi';

dynamoose.aws.sdk.config.update({ region: 'us-east-1' });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/hello', (req: Request, res: Response) => {
  respond(res, OK, { message: 'Hello, world!' });
});

AlumnoApi.mount(app);

export default app;
