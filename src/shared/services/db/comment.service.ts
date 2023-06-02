import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';
import { CommentSchema } from '@comment/models/comment.schema';

//aqui se implementa principio SOLID open / close y single  responsability, ya que las funcionales de esta clase pueden expanderse en variedad
class CommentService {
  // funcion asincrona para crear un comentario, es asincrona ya que los metodo de mongoose son asincronos
  public async createComment(data: ICommentDocument): Promise<ICommentDocument> {
    const comment: ICommentDocument = await CommentSchema.create(data);
    // el metodo "create" es de mongoose,  el permite crear un documento en la DB

    return comment;
  }

  // find comment
  public async searchCommentById(commentId: string): Promise<ICommentDocument> {
    const comment: ICommentDocument = (await CommentSchema.findById({ commentId }).populate([
      { path: 'idAuthor', select: '_id username' },
      { path: 'idVideo', select: 'author title description link likes category' }
    ])) as ICommentDocument;
    //OJO SE DEBE TIPAR ACA LA ESTRUCTURA DE LO QUE VA A DEVOLVER ESTO PARA QUE DONDE SEA IMPLEMENTADO NO TENGA QUE TIPARSE OBLIGATORIAMENTE
    // SE DEBE TIPAR SIEMPRE ENTRADAS Y SALIDAS DE FUNCIONES QUE DEVUELVAN DATOS

    return comment; //EN ESTE CASO DEVUELVE UN COMENTARIO
  }

  // delete a comment
  public async deleteComment(commentId: string): Promise<void> {
    // se busca primero el id del comentario
    const comment: ICommentDocument = (await CommentSchema.findById({ id: commentId })) as ICommentDocument;
    await CommentSchema.deleteOne({ comment }); // se pasa el id del comentario para eliminarlo de la coleccion
    // deleteOne es un metodo de consulta de mongoose el cual sirve para eliminar 1 solo elemento de la coleccion
  }

  // edit the text of a comment
  public async editComment(idAuthor: string, newText: string): Promise<ICommentDocument> {
    const comment: ICommentDocument = (await CommentSchema.updateOne(
      { _id: idAuthor },
      { $set: { text: newText } }
    )) as unknown as ICommentDocument;
    //OJO SE DEBE TIPAR ACA LA ESTRUCTURA DE LO QUE VA A DEVOLVER ESTO PARA QUE DONDE SEA IMPLEMENTADO NO TENGA QUE TIPARSE OBLIGATORIAMENTE
    //lo encontrara por el idAuthor
    //updateOne es un metodo de consulta de mongoose para actualizar un campo , el 1er argumento es el cual buscara, y el 2do argumento sera el que actualizara
    // el $set es un operador de mongo el cual sirve para actualizar el parametro seleccionado
    // el "updateOne" puede actualizar con y sin el operaador $set

    return comment;
  }
}

export const commentService: CommentService = new CommentService();
