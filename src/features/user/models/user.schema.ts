import { model, Model, Schema } from 'mongoose';
import { compare } from 'bcryptjs';
import { IUserDocument } from '@user/interfaces/userDocument.interface';

//In  this file was implemented Design Pattern AAA / Security for Design (SBD)
const userSchema: Schema = new Schema(
  {
    username: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    createdAt: { type: Date, default: Date.now() }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as IUserDocument).password!;
  return compare(password, hashedPassword);
};

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
