export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

interface AppErrorArgs {
  statusCode: HttpStatusCode;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(args: AppErrorArgs) {
    super(args.message);

    this.isOperational = true;
    this.statusCode = args.statusCode;

    Error.captureStackTrace(this);
  }
}
