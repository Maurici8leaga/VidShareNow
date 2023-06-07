import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { userService } from '@root/shared/services/db/user.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { signinSchema } from '@user/schemes/signin';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { config } from '@configs/configEnv';
import HTTP_STATUS from 'http-status-codes';

export class Signin {
  @joiValidation(signinSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const userInExistence: IUserDocument = await userService.getUserByUsername(username);

    if (!userInExistence) {
      throw new BadRequestError('This user was not found');
    }

    const matchingPassword: boolean = await userInExistence.comparePassword(password);
    if (!matchingPassword) {
      throw new BadRequestError('Password does not match');
    }

    const userToken: string = JWT.sign(
      {
        userId: userInExistence._id,
        username: userInExistence.username,
        email: userInExistence.email
      },
      config.JWT_TOKEN!
    );

    req.session = { token: userToken };
    res.status(HTTP_STATUS.OK).json({ message: 'User logged successfully', user: userInExistence, token: userToken });
  }
}
