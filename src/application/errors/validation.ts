export class RequiredFieldError extends Error {
  constructor(fieldName?: string) {
    const message = fieldName
      ? `The field ${fieldName} is required`
      : 'Field required';
    super(message);
    this.name = 'RequiredFieldError';
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')}`);
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}`);
  }
}
