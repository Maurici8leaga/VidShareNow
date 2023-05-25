// los controladores son donde va la logica de negocios
import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { userService } from '@root/shared/services/db/user.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { signinSchema } from '@user/schemes/signin';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { config } from '@configs/configEnv';
import HTTP_STATUS from 'http-status-codes';

export class Signin {
  // asi se usa el decorador de joi
  @joiValidation(signinSchema) // joiValidation es para validar los parametros del request

  // funcion para iniciar sesion del usuario
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const userInExistence: IUserDocument = await userService.getUserByUsername(username);
    // se usa el metodo "getUserByUsername" de authService para buscar el usuario

    if (!userInExistence) {
      // si existe se mandara un mensaje de error
      throw new BadRequestError('This user was not found');
    }

    // variable que comprueba que coincida con la creada en la DB
    const matchingPassword: boolean = await userInExistence.comparePassword(password);
    if (!matchingPassword) {
      // si el password no coincide mandara un mensaje de error
      throw new BadRequestError('Password does not match');
    }

    //  asignacion del token al user
    const userToken: string = JWT.sign(
      // la funcion "sign" es para asignar un token, el cual espera 2 argumentos, 1ro la data del auth del user
      // 2do es un token secreto el cual esta en las variables de entorno
      {
        _id: userInExistence._id,
        username: userInExistence.username,
        email: userInExistence.email
      },
      config.JWT_TOKEN!
    );

    req.session = { token: userToken }; // este "req.session" pertenece al patron doble token security
    res.status(HTTP_STATUS.OK).json({ message: 'User logged successfully', user: userInExistence, token: userToken });
    // por ultimo se envia un json con un mensaje, mas la data del user y el token que tendra para iniciar session
  }
}
