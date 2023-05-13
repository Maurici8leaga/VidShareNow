import { IError } from './error.interface';
// DATO cuando se coloca la I primero seguido del nombre en una interfaz es para hacer saber que es de una interfaz

// se crea una interfaz para asi establecer la estructura que tendra los mensajes de error que la hereden
export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;

  serializeErrors(): IError; //dudas sobre este metodo
}
