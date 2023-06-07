import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// In this file was implemented Principle SOLID Interface Segregation
export interface ICommentDocument extends Document {
  _id: string | ObjectId;
  idVideo: mongoose.Types.ObjectId;
  idAuthor: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}
