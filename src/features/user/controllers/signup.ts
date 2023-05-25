// los controladores son donde va la logica de negocios
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { SignupUtility } from './utilities/signup.utility';
import { signupSchema } from '@user/schemes/signup';
import { userService } from '@root/shared/services/db/user.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { Generators } from '@helpers/generators/generators';
import HTTP_STATUS from 'http-status-codes';

export class Signup extends SignupUtility {
  // asi se usa el decorador de joi
  @joiValidation(signupSchema) // joiValidation es para validar los parametros del request

  // se crea esta funcion para crear el usuario  por 1era vez
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    const verifyIfUserAlreadyExist = await userService.getUserByUsernameOrEmail(username, email);
    // se usa el metodo "getUserByUsernameOrEmail" de userService para buscar el usuario en la db

    if (verifyIfUserAlreadyExist) {
      // si existe se mandara un mensaje de error
      throw new BadRequestError('Erro this user alredy exist');
    }

    //se crea un objectId para el userId y otro para cumplir con la funcion del token
    const id_User: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();

    // passwordHash sera el password del usuario encryptado
    const passwordHashed = await Generators.hash(password);
    // se aplica el generador aqui para que apenas se cree se encrypte el passwordd tanto en la cache de redis como en laa DB

    // este proceso es para validar que la data que se vaya a crear cumpla con la estructura de las interfaces para este modelo
    const userData: IUserDocument = Signup.prototype.signupData({
      // se llama el metodo creado en el file signup.utility "signUpData"
      // IMPORTANTE se debe usar este metodo "SignUp.prototype.signUpData" y no con el this, ya que cuando se agregue esto en la ruta el express no reconocera el metodo con el this
      // en cambio con prototype reconocera que es un metodo que existe de la clase abstracta SignUpUtility
      _id: id_User,
      username,
      email,
      password: passwordHashed
    });

    //  asignacion del token al user
    const userToken: string = Signup.prototype.assignToken(userData, userObjectId);
    // se llama el metodo creado en el file signup.utility "signToken"
    // IMPORTANTE se debe usar este metodo "SignUp.prototype.signToken" y no con el this, ya que cuando se agregue esto en la ruta el express no reconocera el metodo con el this
    // en cambio con prototype reconocera que es un metodo que existe de la clase abstracta SignUpUtility
    req.session = { token: userToken }; // este "req.session" pertenece al patron doble token security
    // de esta forma se le esta dando a la session del user el token

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', user: userData, token: userToken });
    //se le pasa un status de creado el cual es 201
    // por ultimo se envia un json con un mensaje, mas la data del user y el token que tendra para iniciar session
  }
}
