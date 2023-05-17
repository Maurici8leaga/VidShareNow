import { model, Model, Schema } from 'mongoose';
import mongoose from 'mongoose';
// model: es una funcion que resuelve la creacion de shcema del modules
// Model: es una interfaz
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';

// se crea una instancia de Schema de mongoose para los videos
const videoSchema: Schema = new Schema({
  // aqui se definen los argumentos IMPORTANTES con su type
  // DATO YA QUE ESTA EN TYPESCRIPT NO SE COLOCA EL PARAMETRO REQUIRED PORQUE ESTA DEFINIDO EN LA INTERFAZ IVideoDocument

  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //aqui se une el valor de este arg con el de un schema User
  title: { type: String, default: '' }, //es buena practica colocar sus valores por default
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  category: { type: String, default: '' }
});

// VideoSchemaVideoSchema sera el nombre de este Schema el cual sera de tipo IVideoDocument
const VideoSchema: Model<IVideoDocument> = model<IVideoDocument>('Video', videoSchema, 'Video');
// el 1er parametro es el nombre de referencia que tendra en la colleccion de mongoose
// 2do parametro es el Schema
// 3er parametro en model<>() es para la referencia de como quiere ser llamado cuando sea implementado en otro schema, este es opcional ya que se usa solo cuando se va hacer referencia de ese schema en otros schemas
export { VideoSchema }; //se conectan con las otras collecciones implicitamente atraves de mongo
