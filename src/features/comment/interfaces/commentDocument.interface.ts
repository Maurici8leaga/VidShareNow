import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// estas interfaces son como una puerta de acceso o de bloqueo, algo asi como una capa intermedia de cumplimiento de datos

// se crea una interfaz para definir la estructura de un models
// Principle SOLID: Interface Segregation
export interface ICommentDocument extends Document {
  // se hereda Document de mongoose para que la interfaz tenga una estructura como la de mongoose

  _id: string | ObjectId; //el _id es un hash el cual colpassa el valor dentro de el, esto es de mongoose este se genera automatico()
  idVideo: mongoose.Types.ObjectId;
  idAuthor: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}
