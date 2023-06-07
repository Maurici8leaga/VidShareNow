import HTTP_STATUS from 'http-status-codes';
import { CustomError } from './customError';

export class NotAuthorizedError extends CustomError {
  statuscode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
