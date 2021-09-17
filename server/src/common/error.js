export class ServerError extends Error {
  /**
   * 
   * @param {{ status?: number; message?: string; data?: any }} args 
   */
  constructor(args) {
    super();
    this.status = args.status ?? 200;
    this.message = args.message ?? '';
    this.data = args.data;
  }
}

export class BadRequestError extends ServerError {
  constructor({ ...payload }) {
    super({ status: 400, message: 'BadRequest', ...payload });
  }
}

export class UnauthorizedError extends ServerError {
  constructor({ ...payload }) {
    super({ status: 401, message: 'Unauthorized', ...payload });
  }
}

export class ForbiddenError extends ServerError {
  constructor({ ...payload }) {
    super({ status: 403, message: 'Forbidden', ...payload });
  }
}

export class NotFoundError extends ServerError {
  constructor({ ...payload }) {
    super({ status: 404, message: 'Not Found', ...payload });
  }
}

export class InternalServerError extends ServerError {
  constructor({ ...payload }) {
    super({ status: 500, message: 'Internal Server Error', ...payload });
  }
}
