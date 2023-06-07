import { IError } from './error.interface';

// In this file was implemented Design Pattern Facade and Singleton
export abstract class CustomError extends Error {
  abstract statuscode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statuscode
    };
  }
}
