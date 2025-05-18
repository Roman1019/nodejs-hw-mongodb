import { isHttpError } from 'http-errors';

export function notFoundHandler(req, res, next) {
  next(isHttpError(404, 'Contact not found'));
}
