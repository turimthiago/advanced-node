import { mocked } from 'ts-jest/utils';
import { createConnection, getConnectionManager } from 'typeorm';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn()
}));
class PgConnection {
  private static instance?: PgConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance() {
    if (!PgConnection.instance) PgConnection.instance = new PgConnection();
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const connection = await createConnection();
    connection.createQueryRunner();
  }
}

describe('PgConnection', () => {
  it('should have only one instance', () => {
    const sut = PgConnection.getInstance();
    const sut2 = PgConnection.getInstance();
    expect(sut).toBe(sut2);
  });

  it('should create a new connection', async () => {
    const getConnectionManagerSpy = jest.fn().mockResolvedValueOnce({
      has: jest.fn().mockResolvedValueOnce(false)
    });
    mocked(getConnectionManager).mockImplementationOnce(
      getConnectionManagerSpy
    );
    const createQueryRunnerSpy = jest.fn();
    const createConnectionSpy = jest.fn().mockResolvedValueOnce({
      createQueryRunner: createQueryRunnerSpy
    });
    mocked(createConnection).mockImplementationOnce(createConnectionSpy);

    const sut = PgConnection.getInstance();
    await sut.connect();
    expect(createConnectionSpy).toHaveBeenCalledWith();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });
});
