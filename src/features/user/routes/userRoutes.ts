import express, { Router } from 'express';
import { Signup } from '@user/controllers/signup';
import { Signin } from '@user/controllers/signin';
import { SignOut } from '@user/controllers/signout';

// en este class es donde van a ir las rutas hijas para el authentication
class UserRoutes {
  private router: Router; // de esta forma le otorgamos a la var router las propiedades de Router de express

  constructor() {
    this.router = express.Router();
    // "express.Router" es para crear una instancia de un enrutador, el cual administrara las rutas de este class
  }

  // aqui adentro es donde ira la ruta hija para autenticaciones
  public routes(): Router {
    //aqui se implemtenta el desing pattern Mediator https://refactoring.guru/es/design-patterns/mediator
    // y tambien se implementa desing pattern Prototype https://refactoring.guru/es/design-patterns/prototype

    // esta sera una ruta post porque se mandara la info que esta registrando el user
    this.router.post('/signup', Signup.prototype.create);
    // "SignUp.prototype.create" es una copia o referencia del contexto de la funcion que esta dentro de la clase SignUp ya que express no reconoce el metodo de create directamente

    // esta sera una ruta para iniciar sesion del user
    this.router.post('/signin', Signin.prototype.read);
    //patron prototype & mediator ya que el ayuda a gestionar las solicitudes y actua como mediador para que se pueda cumplir los procesos
    // SignIn.prototype.read es el middleware de negocio de signin

    return this.router;
  }

  // aqui adentro es donde ira la ruta hija para desloguear
  public signOut(): Router {
    // esta sera la ruta para desloguear al user, por ser de otro tipo de negocio va apartada de las de autenticaccion
    this.router.get('/signout', SignOut.prototype.logOut);
    // SignOut.prototype.update es el middleware de negoccio de singout

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
