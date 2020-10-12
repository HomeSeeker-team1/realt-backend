import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import config from 'config';

import swaggerDocument from './swagger.json';
import realtorsRouter from './api/controllers/realtors/router';
import ownersRouter from './api/controllers/owners/router';
import auctionRouter from './api/controllers/auction/router';
import mailConfirmRouter from './api/controllers/mailconfirm/router';
import authRouter from './api/controllers/auth/router';

const app: Application = express();
app.use(cors());

const port = process.env.PORT || config.get('port');

// @ts-ignore
app.use(express.json({ extended: true }));
app.use('/', realtorsRouter);
app.use('/', ownersRouter);
app.use('/auction', auctionRouter);
app.use('/auth', authRouter);
app.use('/mail', mailConfirmRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`has been start on ${port}`);
    });
  } catch (e) {
    console.log('error', console.log(e.message));
    process.exit(1);
  }
};

start();
