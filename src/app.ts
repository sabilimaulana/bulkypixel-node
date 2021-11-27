import { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { port, urlDb } from './config';

var app: Application = express();
app.use(cors());

const urlV1 = '/api/v1';
import imageRoute from './routes/image';
import photographerRoute from './routes/photographer';
import mongoose from 'mongoose';

app.use(`${urlV1}/images`, imageRoute);
app.use(`${urlV1}/photographers`, photographerRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', (req: Request, res: Response) => {
  const message = 'Server Nyala';
  res.status(200).json({ message });
});

mongoose
  .connect(urlDb)
  .then(() => {
    app.listen(port, () => {
      console.info(`App is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    throw error;
  });
