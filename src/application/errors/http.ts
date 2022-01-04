export class ServerError extends Error {
  constructor(error?: Error) {
    super('Server failed. Try again soon');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} token is required`);
    this.name = 'RequiredFieldError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export class UnknownError extends Error {
  constructor() {
    super('Unknown error');
    this.name = 'UnknownError';
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden error');
    this.name = 'ForbiddenError';
  }
}
