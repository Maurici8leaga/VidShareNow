import express, { Router } from 'express';
import { Signup } from '@user/controllers/signup';
import { Signin } from '@user/controllers/signin';
import { SignOut } from '@user/controllers/signout';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  //In this method was implemented desing pattern Mediator and Prototype
  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', Signin.prototype.read);
    return this.router;
  }

  public signOut(): Router {
    this.router.get('/signout', SignOut.prototype.logOut);
    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
