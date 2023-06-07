import { Request, Response, Application } from 'express';
import { config } from '@configs/configEnv';
import { userRoutes } from '@user/routes/userRoutes';
import { authMiddleware } from '@helpers/middlewares/auth-middleware';
import { videoRoutes } from '@video/routes/videoRoutes';
import { commentRoutes } from '@comment/routes/commentRoutes';

export default (app: Application) => {
  const routes = () => {
    app.use('/healtcheck', (_req: Request, res: Response) => res.send('Server is OK'));

    app.use(config.BASE_PATH!, userRoutes.routes());

    app.use(config.BASE_PATH!, userRoutes.signOut());

    //In this function was implemented  Patron Chain of Responsibility
    app.use(config.BASE_PATH!, authMiddleware.verifyUserToken, videoRoutes.routes());

    app.use(config.BASE_PATH!, authMiddleware.verifyUserToken, commentRoutes.routes());
  };

  routes();
};
