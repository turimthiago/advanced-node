import { mock, MockProxy } from 'jest-mock-extended';

interface Validator {
  validate(): Error | undefined;
}

class ValidationComposite implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(): Error | undefined {
    return undefined;
  }
}

describe('ValidationComposite', () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;

  beforeAll(() => {
    const validator1 = mock<Validator>();
    validator1.validate.mockReturnValue(undefined);
    const validator2 = mock<Validator>();
    validator2.validate.mockReturnValue(undefined);
  });

  beforeEach(() => {
    sut = new ValidationComposite([validator1, validator2]);
  });

  it('should return undefined if all validator return undefined', () => {
    const error = sut.validate();
    expect(error).toBeUndefined();
  });
});
