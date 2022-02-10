class PgConnection {
  private static instance?: PgConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance() {
    if (!PgConnection.instance) PgConnection.instance = new PgConnection();
    return PgConnection.instance;
  }
}

describe('PgConnection', () => {
  it('should have only one instance', () => {
    const sut = PgConnection.getInstance();
    const sut2 = PgConnection.getInstance();
    expect(sut).toBe(sut2);
  });
});
