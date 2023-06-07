import { Request, Response } from 'express';
import { authMockRequest, authMockResponse, IJWT } from '@root/shared/mocks/user.mock';
import { Signup } from '../signup';
import { CustomError } from '@helpers/errors/customError';
import { userService } from '@root/shared/services/db/user.service';

// In this file was implemented the Patern GIVEN WHEN THEN

jest.useFakeTimers();
jest.mock('@root/shared/services/db/user.service');

describe('SignUp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  // UNITART TEST
  it('it should throw a error if the password is not provided', async () => {
    // GIVEN STEP
    const req: Request = authMockRequest(
      {},
      {
        username: 'lulu3434',
        email: 'lulu@gmail.com',
        password: ''
      }
    ) as Request;

    const res: Response = authMockResponse();

    // WHEN STEP
    await Signup.prototype.create(req, res).catch((error: CustomError) => {
      // THEN STEP: ASSERT

      expect(error.statuscode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Password is a required field');
    });
  });

  // INTEGRATION TEST 2
  it('Should create user successfully', async () => {
    // GIVEN STEP
    const req: Request = authMockRequest(
      {},
      {
        username: 'edu5656',
        email: 'edu@gmail.com',
        password: '123456'
      }
    ) as Request;

    const res: Response = authMockResponse();

    // WHEN STEP

    jest.spyOn(userService, 'getUserByUsernameOrEmail').mockResolvedValue(null!);

    const userSpy = jest.spyOn(userService, 'createUser');

    await Signup.prototype.create(req, res);

    // THEN STEP
    expect(req.session?.token as IJWT).toBeDefined();
    expect(res.status).toHaveBeenCalledWith(201);
    console.log(userSpy.mock, 'esto es userSpy');
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][0],
      token: req.session?.token
    });
  });
});
