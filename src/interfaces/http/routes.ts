import { Request, Response, Application } from 'express';
import { config } from '@configs/configEnv';
import { userRoutes } from '@user/routes/userRoutes';
import { authMiddleware } from '@helpers/middlewares/auth-middleware';
import { videoRoutes } from '@video/routes/videoRoutes';

// funcion anonima que contendra las rutas princiapales a exposicion
export default (app: Application) => {
  // app:Application es para disponibilizar las rutas a express

  const routes = () => {
    //aqui se implementa (Patron Chain of Responsibility)

    // esta ruta es para solo verificar que el server este OK
    app.use('/healtcheck', (_req: Request, res: Response) => res.send('Server is OK'));

    // esta es la ruta padre para el signup y singin
    app.use(config.BASE_PATH!, userRoutes.routes());

    // esta es la ruta padre para el signout
    app.use(config.BASE_PATH!, userRoutes.signOut());

    // ruta padre para los videos
    app.use(config.BASE_PATH!, authMiddleware.verifyUserToken, videoRoutes.routes());
  };

  routes();
};
