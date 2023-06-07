import { Response } from 'express';
import { AuthPayload } from '@user/interfaces/authPayload.interface';

export const authMockRequest = (
  sessionData: IJWT,
  body: IUserMock,
  currentUser?: AuthPayload | null,
  params?: unknown
) => ({
  session: sessionData,
  body,
  currentUser,
  params
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  token?: string;
}

export interface IUserMock {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  createAt?: Date | string;
}
