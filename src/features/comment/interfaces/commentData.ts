import { ObjectId } from 'mongodb';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';

// In this file was implemented Principle SOLID Interface Segregation
export interface ICommentData {
  _id: ObjectId;
  idVideo: IVideoDocument;
  idAuthor: IUserDocument;
  text: string;
}
