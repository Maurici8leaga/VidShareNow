import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// In this file was implemented Principle SOLID Interface Segregation
export interface IVideoDocument extends Document {
  _id: string | ObjectId;
  author: mongoose.Types.ObjectId;
  title: string;
  description: string;
  link: string;
  likes: mongoose.Types.ObjectId[];
  category: string;
  username?: string;
  createdAt?: Date;
}
