import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof HttpError
      ? err.message
      : typeof err.message === 'string' && err.message.trim() !== ''
        ? err.message
        : 'Internal Server Error';

  res.status(status).json({
    message,
  });
};
