import { ObjectId } from 'mongodb';
import JWT from 'jsonwebtoken';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { config } from '@configs/configEnv';
import { ISignUpData } from '@user/interfaces/signUpData.interface';
import { Generators } from '@helpers/generators/generators';

export abstract class SignupUtility {
  protected signupData(data: ISignUpData): IUserDocument {
    const { _id, username, email, password } = data;

    return {
      _id,
      username: Generators.firstLetterCapitalized(username),
      email: Generators.allLetterLowercase(email),
      password,
      createdAt: new Date()
    } as IUserDocument;
  }

  protected assignToken(data: IUserDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        username: data.username,
        email: data.email
      },
      config.JWT_TOKEN!
    );
  }
}
