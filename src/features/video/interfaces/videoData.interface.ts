import { ObjectId } from 'mongodb';
import { IUserDocument } from '@user/interfaces/userDocument.interface';

// In this file was implemented Principle SOLID Interface Segregation
export interface IVideoData {
  _id: ObjectId;
  author: IUserDocument;
  title: string;
  description: string;
  link: string;
  likes: IUserDocument[];
  category: string;
}
