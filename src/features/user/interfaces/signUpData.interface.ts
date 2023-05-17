import { ObjectId } from 'mongodb';

// (SOLID Interface Segregation)
export interface ISignUpData {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
}
