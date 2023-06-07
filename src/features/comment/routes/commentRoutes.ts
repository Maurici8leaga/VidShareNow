import express, { Router } from 'express';
import { Comment } from '@comment/controllers/comment';
import { authMiddleware } from '@helpers/middlewares/auth-middleware';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/video/:videoId/createComment',
      authMiddleware.checkUserAuthentication,
      Comment.prototype.createComment
    );

    this.router.put('/editComment/:commentId', authMiddleware.checkUserAuthentication, Comment.prototype.update);

    this.router.delete('/deleteComment/:commentId', authMiddleware.checkUserAuthentication, Comment.prototype.delete);

    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
