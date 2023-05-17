import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// se crea un interfaz con extension de Document de mongoose para que tenga la estructura de esa interfaz de Document
export interface IUserDocument extends Document {
  _id: string | ObjectId;
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>; //estos seran un metodos que comparara los passwords a la hora de autenticar el user
}
