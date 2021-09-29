import { mock, MockProxy } from 'jest-mock-extended';

interface Validator {
  validate(): Error | undefined;
}

class ValidationComposite implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate();
      if (error !== undefined) return error;
    }
  }
}

describe('ValidationComposite', () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;

  beforeAll(() => {
    validator1 = mock<Validator>();
    validator1.validate.mockReturnValue(undefined);
    validator2 = mock<Validator>();
    validator2.validate.mockReturnValue(undefined);
  });

  beforeEach(() => {
    sut = new ValidationComposite([validator1, validator2]);
  });

  it('should return undefined if all validator return undefined', () => {
    const error = sut.validate();
    expect(error).toBeUndefined();
  });

  it('should return the first error', () => {
    validator1.validate.mockReturnValue(new Error('error_1'));
    validator2.validate.mockReturnValue(new Error('error_2'));
    const error = sut.validate();
    expect(error).toEqual(new Error('error_1'));
  });
});
