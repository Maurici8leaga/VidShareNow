import HTTP_STATUS from 'http-status-codes';
import { CustomError } from './customError';

// In this file was implemented Principle SOLID Liskov Sustitution
export class JoiRequestValidationError extends CustomError {
  statuscode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
