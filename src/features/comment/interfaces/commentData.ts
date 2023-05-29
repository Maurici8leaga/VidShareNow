import { ObjectId } from 'mongodb';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';

export interface ICommentData {
  _id: ObjectId;
  idVideo: IVideoDocument;
  idAuthor: IUserDocument;
  text: string;
}
