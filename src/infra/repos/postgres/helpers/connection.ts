import {
  createConnection,
  getConnection,
  getConnectionManager,
  QueryRunner,
  Repository,
  ObjectType,
  Connection,
  getRepository
} from 'typeorm';
import {
  ConnectionNotFoundError,
  TransactionNotFoundError
} from '@/infra/repos/postgres/helpers';
import { DbTransaction } from '@/application/contracts';

export class PgConnection implements DbTransaction {
  private static instance?: PgConnection;
  private query?: QueryRunner;
  private connection?: Connection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) PgConnection.instance = new PgConnection();
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) throw new ConnectionNotFoundError();
    await getConnection().close();
    this.query = undefined;
    this.connection = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.connection) throw new ConnectionNotFoundError();
    this.query = this.connection.createQueryRunner();
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
    if (!this.connection) throw new ConnectionNotFoundError();
    if (this.query) return this.query.manager.getRepository(entity);
    return getRepository(entity);
  }
}
