import express, { Router } from 'express';
import { Video } from '@video/controllers/video';
import { authMiddleware } from '@helpers/middlewares/auth-middleware';

class VideoRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    // endpoint para obtener todos los videos que tenga la db
    this.router.get('/main', authMiddleware.checkUserAuthentication, Video.prototype.readVideos);

    // endpoint para crear un video
    this.router.post('/createVideo', authMiddleware.checkUserAuthentication, Video.prototype.createVideo);

    // endpoint para buscar un video por  el userId
    this.router.get('/searchVideo/:id', authMiddleware.checkUserAuthentication, Video.prototype.searchVideoByUserId);

    return this.router;
  }
}

export const videoRoutes: VideoRoutes = new VideoRoutes();
