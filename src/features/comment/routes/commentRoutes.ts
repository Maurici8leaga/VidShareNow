import express, { Router } from 'express';
import { Comment } from '@comment/controllers/comment';
import { authMiddleware } from '@helpers/middlewares/auth-middleware';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    // endpoint para crear un comentario en un video
    this.router.post(
      '/video/:videoId/createComment',
      authMiddleware.checkUserAuthentication,
      Comment.prototype.createComment
    );

    // endpoint para editar un comentario
    this.router.put('/editComment/:commentId', authMiddleware.checkUserAuthentication, Comment.prototype.update);

    // endpoint para eliminar un comentario
    this.router.delete('/deleteComment/:commentId', authMiddleware.checkUserAuthentication, Comment.prototype.delete);

    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
