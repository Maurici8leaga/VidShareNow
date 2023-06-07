import { IError } from './error.interface';

// In this file was implemented Principle SOLID Interface Segregation
export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;

  serializeErrors(): IError;
}
