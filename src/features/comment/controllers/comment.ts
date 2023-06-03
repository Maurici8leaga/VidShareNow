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
import { NotAuthorizedError } from '@helpers/errors/notAuthorizedError';

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
    const comment: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);

    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'The comment does not exist' });
    }

    const idUser = new ObjectId(actualUser._id);
    const idAuthorComment = new ObjectId(comment.idAuthor._id);

    // Si se puede usar estos 2 if ya que son para 2 casos distintos
    if (idUser.equals(idAuthorComment)) {
      await commentService.editComment(`${req.params.commentId}`, text);

      const commentUpdated: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);
      // OJO SIEMPRE SE DEBE TIPAR EN ENTRADAS Y SALIDAS DE FUNCIONES QUE DEVUELVAN DATA ES BUENA PRACTICA

      res.status(HTTP_STATUS.CREATED).json({ message: 'Comment update successfully', comment: commentUpdated });
    } else {
      throw new NotAuthorizedError('User not authorized');
    }
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

    const idUser = new ObjectId(actualUser._id);
    const idAuthorComment = new ObjectId(currentComment.idAuthor._id);

    if (idUser.equals(idAuthorComment)) {
      // si el usuario actual no  coincide con el  que creo el comentario entoces no podra realizar la accion
      await commentService.deleteComment(`${currentComment._id}`);
      res.status(HTTP_STATUS.OK).json({ message: 'Comment deleted successfully' });
    } else {
      throw new NotAuthorizedError('User not authorized');
    }
  }
}
