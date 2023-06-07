import { Response } from 'express';
import { AuthPayload } from '@user/interfaces/authPayload.interface';

export const authMockRequest = (
  sessionData: IJWT,
  body: IUserMock,
  currentUser?: AuthPayload | null,
  params?: unknown
) => ({
  session: sessionData, //se necesita el token de la session
  body,
  currentUser,
  params //el params es de tipo "unknown" porque puede existir muchos tipos de parametros
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res); // simular el código de status
  // fn de jest crea un mock de una funcion
  res.json = jest.fn().mockReturnValue(res); // simularemos los datos con los retorne el json
  // mockReturnValue acepta un valor el cual sera retornado cuando el mock function es llamado
  return res;
};

export interface IJWT {
  // estructura con el token de la sesión
  token?: string;
}

export interface IUserMock {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  createAt?: Date | string;
}
