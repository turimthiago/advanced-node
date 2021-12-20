import { UUIDGenerator } from '@/domain/contracts/gateways';

import { mocked } from 'ts-jest/utils';

class UniqueId implements UUIDGenerator {
  constructor(private readonly date: Date) {}

  uuid({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return (
      key +
      '_' +
      this.date.getFullYear() +
      (this.date.getMonth() + 1).toString().padStart(2, '0') +
      this.date.getDate().toString().padStart(2, '0') +
      this.date.getHours().toString().padStart(2, '0') +
      this.date.getMinutes().toString().padStart(2, '0') +
      this.date.getSeconds().toString().padStart(2, '0')
    );
  }
}

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
