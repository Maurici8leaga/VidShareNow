import { model, Model, Schema } from 'mongoose';
// model: es una funcion que resuelve la creacion de shcema del modules
// Model: es una interfaz
import { compare } from 'bcryptjs';
import { IUserDocument } from '@user/interfaces/userDocument.interface';

// se crea una instancia de Schema para los auths
//aqui se implementa Design Pattern AAA / Security for Design (SBD): https://www.ticportal.es/glosario-tic/seguridad-diseno-sbd
// ya que se le limita el schema la data que pueda tener para asi poder restringir y no exponer informacion importante como el password
const userSchema: Schema = new Schema(
  {
    username: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    createdAt: { type: Date, default: Date.now() }
  },
  {
    // despues de declarar los args que llevara el schema se puede agrega, unas ciertas configuracion a algun parametro, por ejemplo;
    toJSON: {
      // es una propieda de opcion de schemas, el cual tiene opciones
      // esta funcionalidad se van a ejecutar cuando el se dectecte un json de este schema
      transform(_doc, ret) {
        // es una funcion para transformar el metodo de schema, el cual necesita 2 parametros 1ro hace referencia al documento
        // 2do son la estructura del documento el cual viene siendo las propiedades que tenga

        delete ret.password; // usamos delete para eliminar del json el password. esto es parte del desing pattern AAA
        return ret; // se retorna el resto de los parametros del json
      }
    }
  }
);

// para crear los propios metodos de consulta se usa:  "nombreSchema"+methods+."nombredelmetodo"
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  // se usa async ya que estos metodos deben esperar que exista y se resuelva el schema para poder ejecutarse

  const hashedPassword: string = (this as IUserDocument).password!; //se coloca ! en ".password!" porque necesita que sea un string
  return compare(password, hashedPassword);
  // compare de bcrypt comparara el password introducido con el ya guardado,
};

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
//model espera 3 argumentos el cual es, 1ro el nombre que llevara el schema y se conocera con las demas
// el 2do es el schema creado, 3ro es la coleccion de la db
export { UserModel }; //se conectan con las otras collecciones implicitamente atraves de mongo
