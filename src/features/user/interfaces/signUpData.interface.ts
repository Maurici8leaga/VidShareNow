import { ObjectId } from 'mongodb';

// In this file was implemented Principle SOLID Interface Segregation
export interface ISignUpData {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
}
