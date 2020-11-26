import { Client, ClientConfig } from 'pg';

const dataBaseCredentials: ClientConfig = {
  user: 'dtjipzmtkziuzj',
  host: 'ec2-52-30-161-203.eu-west-1.compute.amazonaws.com',
  database: 'd1ajv9v465ealb',
  password: '1d90e877e43bbcb870e332f196e024b7d2aa4b998a82b57f68d4789d215f448a',
  port: 5432,
  ssl: {
    // @ts-ignore
    require: true,
    rejectUnauthorized: false,
  },
};

const databaseSqlQuery = async (query: string) => {
  try {
    let client;

    if (process.env.NODE_ENV === 'development') {
      client = new Client(dataBaseCredentials);
    } else {
      client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    }
    await client.connect();
    const response = await client.query(query);
    client.end();
    return response;
  } catch (error) {
    return error;
  }
};

export default databaseSqlQuery;
