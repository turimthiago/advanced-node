import { UniqueId } from '@/infra/gateways';

describe('UniqueId', () => {
  let key: string;
  let sut: UniqueId;

  beforeAll(() => {
    key = 'any_key';
  });

  beforeEach(() => {
    sut = new UniqueId(new Date(2021, 9, 3, 10, 10, 10));
  });

  it('should return correct uuid', () => {
    const uuid = sut.uuid({ key });
    expect(uuid).toBe('any_key_20211003101010');
  });
});
