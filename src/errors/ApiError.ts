export default class ApiError extends Error {
  constructor(msg: string, public statusCode: number = 500) {
    super(msg);
    Error.captureStackTrace(this);
  }
}
