import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import config from 'config';

import swaggerDocument from './swagger.json';
import realtorsRouter from './api/controllers/realtors/router';
import ownersRouter from './api/controllers/owners/router';
import adminRouter from './api/controllers/admins/router';
import auctionRouter from './api/controllers/owners/auction/router';
import activeAuctionsRouter from './api/controllers/activeAuctions/router';
import realtorsBetRouter from './api/controllers/realtors/bet/router';
import mailConfirmRouter from './api/controllers/mailconfirm/router';
import authRouter from './api/controllers/auth/router';

const app: Application = express();
app.use(cors());

const port = process.env.PORT || config.get('port');

if (process.env.NODE_ENV === 'development') {
  swaggerDocument.host = `localhost:${port}`;
  swaggerDocument.schemes[0] = 'http';
}

// @ts-ignore
app.use(express.json({ extended: true }));

app.use('/realtors', realtorsRouter);
app.use('/realtors/bet', realtorsBetRouter);

app.use('/owners', ownersRouter);
app.use('/owners/auction', auctionRouter);
app.use('/active-auctions', activeAuctionsRouter);

app.use('/admins', adminRouter);
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
