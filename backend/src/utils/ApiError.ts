export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string, details?: unknown) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Unauthorized')          { return new ApiError(401, msg); }
  static forbidden(msg = 'Forbidden')                { return new ApiError(403, msg); }
  static notFound(msg = 'Not found')                 { return new ApiError(404, msg); }
  static conflict(msg: string)                       { return new ApiError(409, msg); }
  static unprocessable(msg: string, d?: unknown)     { return new ApiError(422, msg, d); }
  static internal(msg = 'Internal server error')     { return new ApiError(500, msg); }
}
