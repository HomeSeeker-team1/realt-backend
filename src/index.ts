import express, {
  Application, Request, Response,
} from 'express';
import config from 'config';

import databaseSqlQuery from './helpers/database-utils';

const app: Application = express();
const port = process.env.PORT || config.get('port');

app.use('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello from Minsk' });
});

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

const testDataBaseRequest = async () => {
  try {
    const query = 'select * from my_table limit 2';
    const res = await databaseSqlQuery(query);
    console.log('index.ts1', res)
  } catch (error) {
    console.log('index.ts2', error);
  }
};

testDataBaseRequest();

start();
