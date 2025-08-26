export class AppError extends Error {
  statusCode: number;
  code?: string | undefined;
  details?: any;
  constructor(message: string, statusCode = 400, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || undefined;
    this.details = details;
  }
  static NotFound(msg = "Not found") { return new AppError(msg, 404); }
  static Forbidden(msg = "Forbidden") { return new AppError(msg, 403); }
  static Unauthorized(msg = "Unauthorized") { return new AppError(msg, 401); }
  static Conflict(msg = "Conflict") { return new AppError(msg, 409); }
}
