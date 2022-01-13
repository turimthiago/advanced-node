import { RequiredFieldError } from '@/application/errors';

export class Required {
  constructor(readonly value: string, readonly fieldName?: string) {}

  validate(): Error | undefined {
    if (this.value === null || this.value === undefined)
      return new RequiredFieldError(this.fieldName);
  }
}

export class RequiredString extends Required {
  constructor(readonly value: string, readonly fieldName?: string) {
    super(value, fieldName);
  }

  validate(): Error | undefined {
    if (
      super.validate() ||
      this.value === '' ||
      this.value === null ||
      this.value === undefined
    )
      return new RequiredFieldError(this.fieldName);
  }
}
