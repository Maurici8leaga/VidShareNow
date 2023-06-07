import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { SignupUtility } from './utilities/signup.utility';
import { signupSchema } from '@user/schemes/signup';
import { userService } from '@root/shared/services/db/user.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { Generators } from '@helpers/generators/generators';
import HTTP_STATUS from 'http-status-codes';

export class Signup extends SignupUtility {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    const verifyIfUserAlreadyExist = await userService.getUserByUsernameOrEmail(username, email);

    if (verifyIfUserAlreadyExist) {
      throw new BadRequestError('Erro this user alredy exist');
    }

    const id_User: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();

    const passwordHashed = await Generators.hash(password);

    const userData: IUserDocument = Signup.prototype.signupData({
      _id: id_User,
      username,
      email,
      password: passwordHashed
    });

    await userService.createUser(userData);

    const userToken: string = Signup.prototype.assignToken(userData, userObjectId);
    req.session = { token: userToken };

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', user: userData, token: userToken });
  }
}
