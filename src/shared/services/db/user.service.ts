// esta es una abstraccion de codigo de servicios de DB que va en los controladores , PERO por la arquitectura ONION
// se crea esta carpeta de db y se abstrae la logica de esta forma
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { UserModel } from '@user/models/user.schema';
// se importa UserModel para poder realizar las consultas a la DB
import { Generators } from '@helpers/generators/generators';

//aqui se implementa principio SOLID open / close y single  responsability, ya que las funcionales de esta clase pueden expanderse en variedad
class UserService {
  // funcion asincrona para crear un usuario, es asincrona ya que los metodo de mongoose son asincronos
  public async createUser(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
    // el metodo "create" es de mongoose,  el permite crear un documento en la DB
  }

  // funcion asincrona para buscar un usuario por email o username, es asincrona ya que los metodo de mongoose son asincronos
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IUserDocument> {
    // esta funcion espera si o si 2 parametros, username y emaill

    // query sera el argumento a pasar para la busqueda
    const query = {
      // el operador logico "$or" es un operador de mongoDB, retorna el documento que coincida con la condicion pasada, este caso
      // o el email o el username
      $or: [{ username: Generators.firstLetterCapitalized(username) }, { email: Generators.allLetterLowercase(email) }]
      // se debe implementar los metodos "firstLetterCapitalized" y "allLetterLowercase" ya que de existir este user o email
      // fueron guardos con este formato que retorna estos metodos
    };

    const user: IUserDocument = (await UserModel.findOne(query).exec()) as IUserDocument;
    // el metodo "findOne" es de mongoose, el cual sirve para encontrar un documento pasandole query el cual sera un argumento de este documento
    // exec() es una funcion para especificacion de que la query se ejecuto
    // se envuelve todo en parentesis para que cumpla con el contrato y tenga una estructura como la de "IAuthDocument"

    return user;
  }

  // funcion asincrona para buscar un usuario por su username, es asincrona ya que los metodo de mongoose son asincronos
  public async getUserByUsername(username: string): Promise<IUserDocument> {
    const user: IUserDocument = (await UserModel.findOne({
      username: Generators.firstLetterCapitalized(username)
    }).exec()) as IUserDocument;

    return user;
  }
}

export const userService: UserService = new UserService();
