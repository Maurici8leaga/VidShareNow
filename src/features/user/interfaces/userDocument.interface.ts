import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// In this file was implemented Principle SOLID Interface Segregation
export interface IUserDocument extends Document {
  _id: string | ObjectId;
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}
