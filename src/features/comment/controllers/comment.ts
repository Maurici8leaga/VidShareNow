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
  public async createComment(req: Request, res: Response): Promise<void> {
    const { text } = req.body;

    const commentId: ObjectId = new ObjectId();

    const author: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);
    const videoData: IVideoDocument = await videoService.getVideoById(`${req.params.videoId}`);

    const commentData: ICommentDocument = Comment.prototype.commentData({
      _id: commentId,
      idVideo: videoData,
      idAuthor: author,
      text
    });

    const commentCreated = (await commentService.createComment(commentData)) as unknown as ICommentDocument;

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: 'Comment created successfully', comment: commentCreated, video: videoData });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { text } = req.body;

    const actualUser: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);

    const comment: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);

    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'The comment does not exist' });
    }

    const idUser = new ObjectId(actualUser._id);
    const idAuthorComment = new ObjectId(comment.idAuthor._id);

    if (idUser.equals(idAuthorComment)) {
      await commentService.editComment(`${req.params.commentId}`, text);

      const commentUpdated: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);

      res.status(HTTP_STATUS.CREATED).json({ message: 'Comment update successfully', comment: commentUpdated });
    } else {
      throw new NotAuthorizedError('User not authorized');
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const currentComment: ICommentDocument = await commentService.searchCommentById(`${req.params.commentId}`);

    if (!currentComment) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'The comment does not exist' });
    }

    const actualUser: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);

    const idUser = new ObjectId(actualUser._id);
    const idAuthorComment = new ObjectId(currentComment.idAuthor._id);

    if (idUser.equals(idAuthorComment)) {
      await commentService.deleteComment(`${currentComment._id}`);
      res.status(HTTP_STATUS.OK).json({ message: 'Comment deleted successfully' });
    } else {
      throw new NotAuthorizedError('User not authorized');
    }
  }
}
