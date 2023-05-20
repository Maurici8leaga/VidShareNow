import { ObjectId } from 'mongodb';
import JWT from 'jsonwebtoken';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { config } from '@configs/configEnv';
import { ISignUpData } from '@user/interfaces/signUpData.interface';
import { Generators } from '@helpers/generators/generators';

// se crea una clase abstracta para hacer una abstracccion de los metodos a implementar en signup.ts
export abstract class SignupUtility {
  // se crea funcion para validar la entrada y salida de datos de auth del registro

  protected signupData(data: ISignUpData): IUserDocument {
    // "ISignUpData" ES EL CONTRATO que debe cumplir cuando se registre un usuario
    const { _id, username, email, password } = data;

    return {
      _id,
      username: Generators.firstLetterCapitalized(username),
      email: Generators.allLetterLowercase(email),
      password,
      createdAt: new Date()
    } as IUserDocument; // se pasa el pasa "IUserDocument" ya que la estructura espera que se cumpla el formato de la interfaz
  }

  // firmar los datos de authentication para luego liberar el token
  protected assignToken(data: IUserDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      // la funcion "sign" es para asignar un token, el cual espera 2 argumentos, 1ro la data del auth del user
      // 2do es un token secreto el cual esta en las variables de entorno
      {
        userId: userObjectId,
        username: data.username,
        email: data.email
      },
      config.JWT_TOKEN!
    );
  }
}
