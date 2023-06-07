import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { UserModel } from '@user/models/user.schema';
import { Generators } from '@helpers/generators/generators';

// In this file was implemented  Principle SOLID open / close and Design Patern single  responsability
class UserService {
  public async createUser(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IUserDocument> {
    const query = {
      $or: [{ username: Generators.firstLetterCapitalized(username) }, { email: Generators.allLetterLowercase(email) }]
    };

    const user: IUserDocument = (await UserModel.findOne(query).exec()) as IUserDocument;

    return user;
  }

  public async getUserByUsername(username: string): Promise<IUserDocument> {
    const user: IUserDocument = (await UserModel.findOne({
      username: Generators.firstLetterCapitalized(username)
    }).exec()) as IUserDocument;

    return user;
  }
}

export const userService: UserService = new UserService();
