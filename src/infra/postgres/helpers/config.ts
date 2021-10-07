import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'chunee.db.elephantsql.com',
  port: 5432,
  username: 'lqjzauyg',
  password: 'HhPS_XSaiUV6lA7niWd3PviDyq18lA_1',
  database: 'lqjzauyg',
  entities: ['dist/infra/postgres/entities/index.js']
};
