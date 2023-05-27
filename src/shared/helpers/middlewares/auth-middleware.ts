import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from '@helpers/errors/notAuthorizedError';
import { config } from '@configs/configEnv';
import { AuthPayload } from '@user/interfaces/authPayload.interface';

// se crea este class para los middlewares de autenticacion del usuario
export class AuthMiddleware {
  // metodo para verificar el token del usuario al ingresar a la pag
  public verifyUserToken(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.token) {
      // "req.session" apunta a la cookie donde ahi esta la info del user que esta tratando de entrar, si en esta session esta el token
      throw new NotAuthorizedError('Token not provided. Please login again');
    }

    try {
      const payload: AuthPayload = JWT.verify(req.session?.token, config.JWT_TOKEN!) as AuthPayload; // "config.JWT_TOKEN! " este ! es por que es propiedad requerida y con valor implicito
      // "verify" del JWT es para decodificar el token y verificar si es correcto el token o no, como parametro se le pasa
      // 1ro el token de la session entrante y  2do el secret key para desencriptarla y asi poder verificar

      req.currentUser = payload;
      // currentUser es una propiedad que se creo globalmente en el entorno de express en el archivo authPayload.interfacee
      // en el se encontrara la data del user como el id, username, token y email
    } catch (error) {
      // si el token fue modificado y no coincide entonces
      throw new NotAuthorizedError('Token not provided. Please login again');
    }
    next();
  }

  // metodo para verificar si el usuario ya se authentico
  public checkUserAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
