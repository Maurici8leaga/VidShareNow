import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';
import { CommentSchema } from '@comment/models/comment.schema';

// In this file was implemented  Principle SOLID open / close and Design Patern single  responsability
class CommentService {
  public async createComment(data: ICommentDocument): Promise<ICommentDocument> {
    const comment: ICommentDocument = await CommentSchema.create(data);

    return comment;
  }

  public async searchCommentById(commentId: string): Promise<ICommentDocument> {
    const comment: ICommentDocument = (await CommentSchema.findById({ _id: commentId }).populate([
      { path: 'idAuthor', select: '_id username' },
      { path: 'idVideo', select: 'author title description link likes category' }
    ])) as ICommentDocument;

    return comment;
  }

  public async searchCommentByVideoId(videoId: string): Promise<ICommentDocument[]> {
    const comment: ICommentDocument[] = (await CommentSchema.find({ idVideo: videoId }).populate([
      { path: 'idAuthor', select: '_id username' }
    ])) as unknown as ICommentDocument[];

    return comment;
  }

  public async deleteComment(commentId: string): Promise<void> {
    await CommentSchema.deleteOne({ _id: commentId });
  }

  public async editComment(id: string, newText: string): Promise<ICommentDocument> {
    const comment: ICommentDocument = (await CommentSchema.updateOne(
      { _id: id },
      { $set: { text: newText } }
    )) as unknown as ICommentDocument;

    return comment;
  }
}

export const commentService: CommentService = new CommentService();
