import {
  createConnection,
  getConnection,
  getConnectionManager,
  QueryRunner,
  Repository,
  ObjectType
} from 'typeorm';
import { ConnectionNotFoundError } from '@/infra/repos/postgres/helpers';
import { TransactionNotFoundError } from './errors';

export class PgConnection {
  private static instance?: PgConnection;
  private query?: QueryRunner;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) PgConnection.instance = new PgConnection();
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection();
    this.query = connection.createQueryRunner();
  }

  async disconnect(): Promise<void> {
    if (!this.query) throw new ConnectionNotFoundError();
    await getConnection().close();
    this.query = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.query) throw new ConnectionNotFoundError();
    this.query?.startTransaction();
  }

  async closeTransaction(): Promise<void> {
    if (!this.query) throw new TransactionNotFoundError();
    this.query?.release();
  }

  async commit(): Promise<void> {
    if (!this.query) throw new TransactionNotFoundError();
    this.query?.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.query) throw new TransactionNotFoundError();
    this.query?.rollbackTransaction();
  }

  getRepository<Entity>(entity: ObjectType<Entity>): Repository<Entity> {
    if (!this.query) throw new ConnectionNotFoundError();
    return this.query?.manager.getRepository(entity);
  }
}
