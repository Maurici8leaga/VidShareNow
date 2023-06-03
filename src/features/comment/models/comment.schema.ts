import { model, Model, Schema } from 'mongoose';
import mongoose from 'mongoose';
// model: es una funcion que resuelve la creacion de shcema del modules
// Model: es una interfaz
import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';

// se crea una instancia de Schema de mongoose para los videos
const commentSchema: Schema = new Schema({
  // aqui se definen los argumentos IMPORTANTES con su type
  // DATO YA QUE ESTA EN TYPESCRIPT NO SE COLOCA EL PARAMETRO REQUIRED PORQUE ESTA DEFINIDO EN LA INTERFAZ IVideoDocument

  idVideo: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' }, //aqui se une el valor de este arg con el de un schema Video
  idAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //aqui se une el valor de este arg con el de un schema User
  text: { type: String, default: '' }, //es buena practica colocar sus valores por default
  createdAt: { type: Date, default: Date.now() }
});

// CommentSchema sera el nombre de este Schema el cual sera de tipo ICommentDocument
const CommentSchema: Model<ICommentDocument> = model<ICommentDocument>('Comment', commentSchema, 'Comment');
// el 1er parametro es el nombre de referencia que tendra en la colleccion de mongoose
// 2do parametro es el Schema
// 3er parametro en model<>() es para la referencia de como quiere ser llamado cuando sea implementado en otro schema, este es opcional ya que se usa solo cuando se va hacer referencia de ese schema en otros schemas
export { CommentSchema }; //se conectan con las otras collecciones implicitamente atraves de mongo
