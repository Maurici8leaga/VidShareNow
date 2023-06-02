// los controladores son donde va la logica de negocios
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { videoScheme } from '@video/schemes/video';
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { userService } from '@root/shared/services/db/user.service';
import { videoService } from '@root/shared/services/db/video.service';
import { VideoUtility } from './utilities/video.utility';
import HTTP_STATUS from 'http-status-codes';

export class Video extends VideoUtility {
  // asi se usa el decorador de joi
  @joiValidation(videoScheme) // joiValidation es para validar los parametros del request

  //controlador para crear video
  public async createVideo(req: Request, res: Response): Promise<void> {
    const { title, description, link, category } = req.body;

    // creacion del id del video
    const videoId: ObjectId = new ObjectId();

    // request para buscar en la db el usuario
    const user: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);

    // la data con la estructura del video
    const videoData: IVideoDocument = Video.prototype.videoData({
      _id: videoId,
      author: user,
      title,
      description,
      link,
      category,
      likes: []
    });

    // request a la db para crear el video
    const videoCreated = (await videoService.createVideo(videoData)) as unknown as IVideoDocument;

    res.status(HTTP_STATUS.CREATED).json({ message: 'Video created successfully', video: videoCreated });
  }

  // controlador para tener todos los videos de la db
  public async readVideos(_req: Request, res: Response): Promise<void> {
    // dudas si esta bien este type  de IVideoDocument ya que esta respuesta traera un array de todos los videos
    const videoList: IVideoDocument = await videoService.getAllVideos();

    if (!videoList) {
      // verificar como responde el server con este caso
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'There are not videos yet', videoArray: [] });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Successful request', videoArray: videoList });
  }

  //  controlador para buscar un video por el authorId
  public async searchVideoByUserId(req: Request, res: Response): Promise<void> {
    const video: IVideoDocument = await videoService.getVideoByUserId(`${req.params.id}`);

    if (!video) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Video not found' });
    }

    // verificar si esta respuesta los comentarios aparecen populados o no, y en tal caso si  hay que hacer un request
    // a la db para obtenere los comentarios en ella
    // res.status(HTTP_STATUS.OK).json({ message: 'Successful request' });
    res.status(HTTP_STATUS.OK).json({ message: 'Successful request', video: video });
  }
}
