import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { commentScheme } from '@comment/schemes/comment';
import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { commentService } from '@root/shared/services/db/comment.service';
import { userService } from '@root/shared/services/db/user.service';
import { videoService } from '@root/shared/services/db/video.service';
import { CommentUtility } from './utilities/comment.utility';
import HTTP_STATUS from 'http-status-codes';

export class Comment extends CommentUtility {
  @joiValidation(commentScheme)

  // controlador para crer comment
  public async createComment(req: Request, res: Response): Promise<void> {
    const { text } = req.body;

    // creacion del id del comment
    const commentId: ObjectId = new ObjectId();

    // buscar el autor del video  y el video en el que se esta haciendo el comentario
    const author: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);
    const videoData: IVideoDocument = await videoService.getVideoById(`${req.params.videoId}`);

    // la data con la estructura dell comentario
    const commentData: ICommentDocument = Comment.prototype.commentData({
      _id: commentId,
      idVideo: videoData,
      idAuthor: author,
      text
    });

    // request a la db para crear el comment
    const commentCreated = (await commentService.createComment(commentData)) as unknown as ICommentDocument;

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: 'Comment created successfully', comment: commentCreated, video: videoData });
  }

  // controlador para act un comentario
  public async update(req: Request, res: Response): Promise<void> {
    const { text } = req.body;

    // buscar el usuario actual en la session
    const actualUser: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);

    // buscar el comentario el cual se quiere actualizar
    const currentComment: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);

    if (!currentComment) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'The comment does not exist' });
    }

    // Si se puede usar estos 2 if ya que son para 2 casos distintos
    if (actualUser._id !== currentComment.idAuthor._id) {
      // si el usuario actual no  coincide con el  que creo el comentario entoces no podra realizar la accion
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authorized' });
    }

    // OJO SIEMPRE SE DEBE TIPAR EN ENTRADAS Y SALIDAS DE FUNCIONES QUE DEVUELVAN DATA ES BUENA PRACTICA
    const commetUpdated: ICommentDocument = await commentService.editComment(`${currentComment.idAuthor._id}`, text);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Comment update successfully', comment: commetUpdated });
  }

  // controlador para  eliminar un comentario
  public async delete(req: Request, res: Response): Promise<void> {
    // buscar el comentario que se quiere eliminar
    const currentComment: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);

    if (!currentComment) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'The comment does not exist' });
    }

    // buscar el usuario actual en la session
    const actualUser: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);

    if (actualUser._id !== currentComment.idAuthor._id) {
      // si el usuario actual no  coincide con el  que creo el comentario entoces no podra realizar la accion
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authorized' });
    }

    await commentService.deleteComment(`${currentComment._id}`);

    res.status(HTTP_STATUS.OK).json({ message: 'Comment deleted successfully' });
  }
}
