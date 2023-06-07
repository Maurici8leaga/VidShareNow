import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';
import { ICommentData } from '@comment/interfaces/commentData';
import { Generators } from '@helpers/generators/generators';

export abstract class CommentUtility {
  protected commentData(data: ICommentData): ICommentDocument {
    const { _id, idVideo, idAuthor, text } = data;
    return {
      _id,
      idVideo,
      idAuthor,
      text: Generators.firstLetterCapitalized(text),
      createdAt: new Date()
    } as unknown as ICommentDocument;
  }
}
